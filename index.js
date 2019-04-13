const express = require('express');
const Web3 = require('web3');
const implementationABI = require('./bnb.json')
const app = express();

const infuraWebsocketLink = "wss://mainnet.infura.io/ws/";
const contractAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52" // BNB contract address

const provider = new Web3.providers.WebsocketProvider(infuraWebsocketLink);
const web3 = new Web3(provider);

let contract = web3.eth.Contract(implementationABI, contractAddress);

async function getContractDetails() {
    let name = await contract.methods.name().call();
    let symbol = await contract.methods.symbol().call();
    let decimals = await contract.methods.decimals().call();
    return {'name: ': name, 'symbol: ': symbol, 'decimals: ': decimals};
}

async function getOwner() {
    let owner = await contract.methods.owner().call();
    return {'owner: ': owner};
}

async function getBalanceOf(address) {
    let balance = await contract.methods.balanceOf(address).call();
    balance = (balance._hex);
    balance = web3.utils.hexToNumberString(balance);
    return {'Balance of address: ': balance};
}

async function getTotalSupply() {
    let supply = await contract.methods.totalSupply().call();
    supply = supply.toString();
    return {'Total supply (with decimals): ': supply};
}

async function getTransferEvents() {
    let currentBlock = await web3.eth.getBlockNumber();
    let fromBlock = currentBlock - 100;
    let events = await contract.getPastEvents('Transfer', {fromBlock: fromBlock, toBlock: currentBlock});
    return {'Transfer events for token: ': events};
}

async function getBurnEvents() {
    let currentBlock = await web3.eth.getBlockNumber();
    let fromBlock = currentBlock - 100;
    let events = await contract.getPastEvents('Burn', {fromBlock: fromBlock, toBlock: currentBlock});
    return {'Burn events for token: ': events};
}

async function getFreezeEvents() {
    let currentBlock = await web3.eth.getBlockNumber();
    let fromBlock = currentBlock - 100;
    let events = await contract.getPastEvents('Freeze', {fromBlock: fromBlock, toBlock: currentBlock});
    return {'Freeze events for token: ': events};
}

async function getEvents(event) {
    switch(event) {
        case 'transfer': return getTransferEvents();
        case 'burn': return getBurnEvents();
        case 'freeze': return getFreezeEvents();
        default: return 'Must be freeze, burn or transfer';
    }
}

app.get('/contract/details', async function (req, res) {
    let response = await getContractDetails();
    res.send(response);
});

app.get('/contract/owner', async function (req, res) {
    let response = await getOwner();
    res.send(response);
});

app.get('/contract/supply', async function (req, res) {
    let response = await getTotalSupply();
    res.send(response);
});

app.get('/contract/balance/:address', async function (req, res) {
    let response = await getBalanceOf(req.params.address);
    res.send(response);
});

app.get('/contract/events/:id', async function (req, res) {
    let response = await getEvents(req.params.id);
    res.send(response);
});

app.listen(7000, () => console.log('Listening on port 7000, GET /contract/details/, /contract/owner' +
                        ', /contract/supply, /contract/balance/:address/, /contract/events/:id'));