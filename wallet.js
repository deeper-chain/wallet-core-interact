const express = require('express');
const { spawn } = require('child_process');
const axios = require('axios');

const app = express();

app.use(express.json());

// HD wallet binary path
const HD_WALLET_PATH = '../hd-wallet/target/release/hd-wallet';

// Proxy server endpoint
const PROXY_SERVER_ENDPOINT = 'http://localhost:8080';

// Default gas price and limit
const GAS_PRICE = '296835814432';
const GAS_LIMIT = '21000';

// Endpoint for transferring Ethereum
app.post('/transfer_ethereum', async (req, res) => {
  const { from_address, to_address, amount } = req.body;

  try {
    // Get the nonce for the from_address from the proxy server
    const response = await axios.get(`${PROXY_SERVER_ENDPOINT}/get_nonce/${from_address}/goerli`);
    const nonce = response.data.nonce;

    // Prepare the payload to be signed by the hardware wallet
    const payload = {
      method: 'sign_tx',
      param: {
        id: '98641afb-aee4-4f35-a72e-b1781d4741fd',
        chain_type: 'ETHEREUM',
        address: from_address,
        input: {
          nonce: nonce.toString(),
          to: to_address,
          value: amount.toString(),
          gas_price: GAS_PRICE,
          gas: GAS_LIMIT,
          data: '',
          network: 'GOERLI',
        },
        key: {
          Password: '',
        },
      },
    };
    const jsonPayload = JSON.stringify(payload);

    // Call the hardware wallet binary and pass in the JSON payload
    const childProcess = spawn(HD_WALLET_PATH, ['sign_tx', jsonPayload]);
    const stdout = [];
    for await (const chunk of childProcess.stdout) {
      stdout.push(chunk);
    }
    const responseFromHardwareWallet = Buffer.concat(stdout).toString().trim();

    // Parse the response from the hardware wallet
    const result = JSON.parse(responseFromHardwareWallet);
    const signature = JSON.parse(result).signature;
    const signedTransaction = `0x${signature.replace(/^"|"$/g, '')}`;

    // Send the signed transaction to the proxy server
    const proxyResponse = await axios.post(`${PROXY_SERVER_ENDPOINT}/send_transaction_raw/goerli/${signedTransaction}`, {
      raw_transaction: signedTransaction,
    });

    // Return the response from the proxy server
    res.status(200).send(proxyResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while transferring Ethereum');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Listening on port 3000');
});

