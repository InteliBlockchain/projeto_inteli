//npm modules
import Web3 from "web3";
const HDWalletProvider = require("@truffle/hdwallet-provider");

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //configure web3 with data provided by MetaMask
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // MetaMask extension not installed *OR* process is running server side
  const provider = new HDWalletProvider(
    "", //mnemonico aqui
    "" //url do node provider aqui
  );
  web3 = new Web3(provider);
}

web3 = new Web3(provider);

export default web3;
