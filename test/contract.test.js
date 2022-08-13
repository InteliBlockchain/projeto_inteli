//built-in module
const assert = require('assert')
//npm modules
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
//compiled smart contracts
const compiledInteliFactory = require('../ethereum/artifacts/ethereum/contracts/InteliFactory.sol/InteliFactory.json')
const compiledLectureFactory = require('../ethereum/artifacts/ethereum/contracts/LectureFactory.sol/LectureFactory.json')
const compiledAccessCampus = require('../ethereum/artifacts/ethereum/contracts/AccessCampus.sol/AccessCampus.json')

//reusable variables
let accounts
let inteliFactory

//test setup
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    inteliFactory = await new web3.eth.Contract(compiledInteliFactory.abi)
        .deploy({ data: compiledInteliFactory.bytecode })
        .send({ from: accounts[0], gas: '2500000' })

    lectureFactory = await new web3.eth.Contract(compiledLectureFactory.abi)
        .deploy({ data: compiledLectureFactory.bytecode })
        .send({ from: accounts[0], gas: '2500000' })

    accessCampus = await new web3.eth.Contract(compiledAccessCampus.abi)
        .deploy({ data: compiledAccessCampus.bytecode })
        .send({ from: accounts[0], gas: '2500000' })

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
})

//test factory functionalities
describe('factory tests', async () => {
    it('deploys factory contract', () => {
        assert.ok(inteliFactory.options.address)
    })

    it('sets owner properly', async () => {
        let owner = await inteliFactory.methods.owner().call()
        assert.equal(accounts[0], owner)
    })

    it('creates a student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })
    })
})

//test lectureFactory
describe('lectureFactory tests', async () => {
    it('deploys lectureFactory contract', () => {
        assert.ok(lectureFactory.options.address)
    })
    it('sets owner properly', () => {
      let owner = await lectureFactory.methods.owner().call()
        assert.equal(accounts[0], owner)
    })
    it('creates a new lecture', () => {
    })
    it('see all lectures', async () => {
      let lectures = await lectureFactory.methods.lectures().call()
    })
})
