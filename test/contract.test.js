//built-in module
const assert = require("assert");
//npm modules
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
//compiled smart contracts
const compiledInteliFactory = require("../ethereum/artifacts/ethereum/contracts/InteliFactory.sol/InteliFactory.json");

//reusable variables
let accounts;
let factory;

//test setup
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledInteliFactory.abi)
    .deploy({ data: compiledInteliFactory.bytecode })
    .send({ from: accounts[0], gas: "2500000" });

  // await factory.methods
  //   .deployContractMethod()
  //   .send({ from: accounts[0], gas: "1000000" });

  //someMethod(): some get contract address method
  //              returns type address
  // stateVariable1 = await factory.methods.someMethod().call();
  //sets up deployed contract
  // stateVariable2 = await new web3.eth.Contract(
  //   JSON.parse(compiledContract.interface),
  //   stateVariable1
  // );
});

//test factory functionalities
describe("factory tests", async () => {
  it("deploys factory contract", () => {
    assert.ok(factory.options.address);
  });

  it("sets owner as msg.sender", async () => {
    assert(await factory.methods.getDeployedContracts().call());
  });
});
