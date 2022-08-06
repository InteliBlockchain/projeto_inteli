//built-in module
const assert = require("assert");
//npm modules
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
//compiled smart contracts
const compiledFactory = require("../ethereum/build/Factory.json");
const compiledContract = require("../ethereum/build/contract.json");

//reusable variables
let stateVariable1;
let stateVariable2;

//test setup
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .deployContractMethod()
    .send({ from: accounts[0], gas: "1000000" });

  //someMethod(): some get contract address method
  //              returns type address
  stateVariable1 = await factory.methods.someMethod().call();
  //sets up deployed contract
  stateVariable2 = await new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    stateVariable1
  );
});

//test factory functionalities
describe("factory tests", async () => {
  it("deploys factory contract", () => {
    assert.ok(factory.options.address);
  });

  it("returns list of deployed contracts", async () => {
    assert(await factory.methods.getDeployedContracts().call());
  });
});
