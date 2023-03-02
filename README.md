# Ethereum Hardware Wallet Integration
This project demonstrates how to integrate a hardware wallet with an Ethereum application. Specifically, it shows how to use a hardware wallet to sign a transaction and send it to a proxy server for broadcasting to the Ethereum network.

## Installation
1. Clone this repository to your local machine.  

2. Install Node.js if you haven't already. You can download it from the official Node.js website: https://nodejs.org/  

3. Install the project's dependencies by running the following command in the project root directory:  

```bash
npm install
```
4. Build the project by running the following command:  
```bash
npm run build
```
## Usage
1. Connect your hardware wallet to your computer.  

2. Start the proxy server by following the instructions in the README.md file in the ```proxy-server``` directory.  

3. Start the application by running the following command in the project root directory:  

```bash
npm start
```
4. Use the following command to transfer Ethereum from one address to another: 
```bash
curl -X POST -H "Content-Type: application/json" -d '{"from_address": "<from_address>", "to_address": "<to_address>", "amount": "<amount>"}' http://localhost:3000/transfer_ethereum
```
Replace ```<from_address>```,``` <to_address>```, and ```<amount>``` with the appropriate values for your use case.

## License
This project is licensed under the MIT License - see the LICENSE file for details.