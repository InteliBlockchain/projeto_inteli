//built-in module
const assert = require('assert')
//npm modules
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const truffleAssert = require('truffle-assertions')
//compiled smart contracts
const compiledLecture = require('../ethereum/artifacts/ethereum/contracts/Lecture.sol/Lecture.json')

//reusable variables
let accounts
let lecture

//test setup
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    web3.eth.handleRevert = true

    lecture = await new web3.eth.Contract(compiledLecture.abi)
        .deploy({ data: compiledLecture.bytecode, arguments: [accounts, '', accounts[0]] })
        .send({ from: accounts[0], gas: '25000000' })
})

describe('lecture test', async () => {
    it('sees if the burn lecture works', async () => {
        assert.ok(
            await lecture.methods.burnNFT(accounts[1]).send({
                from: accounts[0],
                gas: '2500000',
            })
        )
    })
})

describe('lecture error test', async () => {
    it('sees if the burn lecture works', async () => {
        await truffleAssert.fails(lecture.methods.burnNFT(accounts[1]).send({
                from: accounts[1],
                gas: '2500000'
            }), truffleAssert.ErrorType.REVERT)
    })
})
