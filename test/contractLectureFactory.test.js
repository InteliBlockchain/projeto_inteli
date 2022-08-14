//built-in module
const assert = require('assert')
//npm modules
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
//compiled smart contracts
const compiledLectureFactory = require('../ethereum/artifacts/ethereum/contracts/LectureFactory.sol/LectureFactory.json')

//reusable variables
let accounts
let lectureFactory
let newLecture
let newLectureAddress

//test setup
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    web3.eth.handleRevert = true
    //deploying lectureFactory and its children
    lectureFactory = await new web3.eth.Contract(compiledLectureFactory.abi)
        .deploy({ data: compiledLectureFactory.bytecode })
        .send({ from: accounts[0], gas: '25000000' })

    newLecture = await lectureFactory.methods
        .createLecture([accounts[0]], '')
        .send({ from: accounts[0], gas: '25000000' })

    newLectureAddress = JSON.parse(JSON.stringify(newLecture.events.NewLecture.returnValues))[0]
})

//test lectureFactory functionalities 
describe('lectureFactory tests', async () => {
    it('deploys lectureFactory contract', () => {
        assert.ok(lectureFactory.options.address)
    })

    it('sets owner properly', async () => {
        let owner = await lectureFactory.methods.owner().call()
        assert.equal(accounts[0], owner)
    })

    it('creates a new lecture', async () => {
        assert(
            await lectureFactory.methods
                .createLecture([accounts[0], accounts[1], accounts[2], accounts[3]], '')
                .send({ from: accounts[0], gas: '25000000' })
        )
    })

    it('returns the same address as the one that exist in the contract`s array', async () => {
        let lectures = await lectureFactory.methods.viewLectures().call({ from: accounts[0] })
        assert.equal(lectures[lectures.length - 1], newLectureAddress)
    })

    it('sees if all contracts are in the lectures`s array', async () => {
        let lectures = await lectureFactory.methods.viewLectures().call({ from: accounts[0] })
        assert.equal(lectures.length, 1)
    })
})
