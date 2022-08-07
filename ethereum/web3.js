//npm modules
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

let web3;
// MetaMask extension not installed *OR* process is running server side
const provider = new HDWalletProvider(
  "prefer output citizen artwork major aunt moment hero spot asthma quick report",
  "https://rinkeby.infura.io/v3/ce4c9d4f09204bf58decc5edbffe4d38"
);
web3 = new Web3(provider);

module.exports = {
  web3,
};
