## A node module to read token details from ethereum blockchain
### Uses web3js to read data and express for routing

### Instructions for use :

1. git clone
2. npm install
3. npm start
4. Use Postman/Insomnia/curl (or your browser) to GET HTTP Routes
5. View live token data from ethereum blockchain

### Available routes :

http://localhost:7000/contract/details
http://localhost:7000//contract/owner
http://localhost:7000//contract/supply
http://localhost:7000//contract/balance/:address
http://localhost:7000//contract/events/:id