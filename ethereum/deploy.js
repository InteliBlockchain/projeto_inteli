//npm modules
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
//compiled smart contracts
const compiledInteliFactory = require("./build/InteliFactory.json");
const compiledAccessCampus = require("./build/AccessCampus.json");

//setup rinkeby account
const provider = new HDWalletProvider(
  "prefer output citizen artwork major aunt moment hero spot asthma quick report",
  "https://rinkeby.infura.io/v3/ce4c9d4f09204bf58decc5edbffe4d38"
);
const web3 = new Web3(provider);

//setup deployment of factory
const deployFactory = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledInteliFactory.abi)
      .deploy({ data: compiledInteliFactory.evm.bytecode.object })
      .send({ gas: "25000000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
    return result.options.address;
  } catch (err) {
    console.log(err);
  }
};
deployFactory();

//setup deployment of acessCampus
const deployAccessCampus = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledAccessCampus.abi)
      .deploy({ data: compiledAccessCampus.evm.bytecode.object })
      .send({ gas: "1000000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
    return result.options.address;
  } catch (err) {
    console.log(err);
  }
};

//module.exports = { deployFactory, deployContract };
