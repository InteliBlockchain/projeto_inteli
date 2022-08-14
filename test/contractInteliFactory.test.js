//built-in module
const assert = require('assert')
//npm modules
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
//compiled smart contracts
const compiledInteliFactory = require('../ethereum/artifacts/ethereum/contracts/InteliFactory.sol/InteliFactory.json')

//reusable variables
let accounts
let inteliFactory

//test setup
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    web3.eth.handleRevert = true
    //deploying inteliFactory
    inteliFactory = await new web3.eth.Contract(compiledInteliFactory.abi)
        .deploy({ data: compiledInteliFactory.bytecode })
        .send({ from: accounts[0], gas: '25000000' })
})

//test inteliFactory functionalities
describe('factory tests', async () => {
    it('deploys factory contract', () => {
        assert.ok(inteliFactory.options.address)
    })

    it('sets owner properly', async () => {
        let owner = await inteliFactory.methods.owner().call()
        assert.equal(accounts[0], owner)
    })

    it('creates a student', async () => {
        assert(await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }))
    })

    it('deletes a student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })

        assert(await inteliFactory.methods.removeStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }))
    })

    it('deletes a student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })

        assert(await inteliFactory.methods.removeStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }))
    })
})
