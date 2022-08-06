//npm modules
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
//compiled smart contracts
const compiledFactory = require("./build/Factory.json");
const compiledContract = require("./build/contract.json");

//setup rinkeby account
const provider = new HDWalletProvider(
  "", //mnemônico aqui
  "" //url do node de rinkeby na infura (rinkeby vai ser deprecado - talvez valha a gente atualizar a testnet)
);
const web3 = new Web3(provider);

//setup deployment of factory
const deployFactory = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "1400000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
  return result.options.address;
};

//setup manual deployment of contract
const deployContract = async (param1, param2, param3) => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy contract from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledContract.interface)
  )
    .deploy({
      data: compiledContract.bytecode,
      arguments: [param1, param2, param3],
    })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
  return result.options.address;
};

module.exports = { deployFactory, deployContract };
