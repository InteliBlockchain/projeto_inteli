//built-in module
const assert = require('assert')
//npm modules
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const truffleAssert = require('truffle-assertions')
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
describe('inteliFactory tests', async () => {
    it('deploys inteliFactory contract', () => {
        assert.ok(inteliFactory.options.address)
    })

    it('sets owner properly', async () => {
        let owner = await inteliFactory.methods.owner().call()
        assert.equal(accounts[0], owner)
    })

    it('creates a student', async () => {
        assert(await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }))
    })

    it('checks erros "not owner" creates a student', async () => {
        await truffleAssert.fails(
            inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[1], gas: '2500000' }, truffleAssert.ErrorType.REVERT)
        )
    })

    it('checks erros "student already exists" creates a student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })
        await truffleAssert.fails(
            inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }, truffleAssert.ErrorType.REVERT)
        )
    })

    it('get wallet of student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })
        let address = await inteliFactory.methods.getArrStudent().call({ from: accounts[0] })
        let wallet = await inteliFactory.methods.getWallet('A2022.1A.0XXX').call({ from: accounts[0] })
        assert.equal(wallet, address[0])
    })

    it('get wallet of student and array of students "not owner" error', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })
        await truffleAssert.fails(inteliFactory.methods.getArrStudent().call({ from: accounts[1] }), truffleAssert.ErrorType.REVERT)
        await truffleAssert.fails(inteliFactory.methods.getWallet('A2022.1A.0XXX').call({ from: accounts[1] }), truffleAssert.ErrorType.REVERT)
    })

    it('get ra of student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })
        let address = await inteliFactory.methods.getArrStudent().call({ from: accounts[0] })
        let id = await inteliFactory.methods.getStudent(address[0]).call({ from: accounts[0] })
        assert.equal(id, 'A2022.1A.0XXX')
    })

    it('get ra of student "not owner" error', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })
        let address = await inteliFactory.methods.getArrStudent().call({ from: accounts[0] })
        await truffleAssert.fails(inteliFactory.methods.getStudent(address[0]).call({ from: accounts[1] }), truffleAssert.ErrorType.REVERT)
    })

    it('deletes a student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })

        assert(await inteliFactory.methods.removeStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }))
    })

    it('"not owner" error in deletes a student', async () => {
        await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })

        await truffleAssert.fails(
            inteliFactory.methods.removeStudent('A2022.1A.0XXX').send({ from: accounts[1], gas: '2500000' }, truffleAssert.ErrorType.REVERT)
        )
    })

    it('"Student does not exist" error in deletes a student ', async () => {
        await truffleAssert.fails(
            inteliFactory.methods.removeStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }, truffleAssert.ErrorType.REVERT)
        )
    })
})
