//built-in module
const assert = require('assert')
//npm modules
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const decoder = require('../ethereum/utils/structDecoder')
const truffleAssert = require('truffle-assertions')
//compiled smart contracts
const compiledAccessCampus = require('../ethereum/artifacts/ethereum/contracts/AccessCampus.sol/AccessCampus.json')

//reusable variables
let accounts
let accessCampus

//test setup
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    web3.eth.handleRevert = true

    //deploying accessCampus and its children
    accessCampus = await new web3.eth.Contract(compiledAccessCampus.abi)
        .deploy({ data: compiledAccessCampus.bytecode })
        .send({ from: accounts[0], gas: '25000000' })

    await accessCampus.methods
        .registerCheckIn(accounts[0], 12345, '14/08/2022')
        .send({ from: accounts[0], gas: '25000000' })

    await accessCampus.methods
        .registerCheckOut(accounts[0], 12345, '14/08/2022')
        .send({ from: accounts[0], gas: '25000000' })
})

//test accessCampus functionalities
describe('access campus tests', async () => {
    it('deploys accessCampus contract', () => {
        assert.ok(accessCampus.options.address)
    })

    it('sets owner properly', async () => {
        let owner = await accessCampus.methods.owner().call()
        assert.equal(accounts[0], owner)
    })

    it('checks if it is creating the appropriately checksIn and checksOut', async () => {
        const contractsFunctions = [accessCampus.methods.registerCheckIn, accessCampus.methods.registerCheckOut]
        for (element of contractsFunctions) {
            assert(await element(accounts[0], 12345, '14/08/2022').send({ from: accounts[0], gas: '25000000' }))
        }
    })

    it('checks error "not owner" in checksIn and checksOut', async () => {
        const contractsFunctions = [accessCampus.methods.registerCheckIn, accessCampus.methods.registerCheckOut]
        for (element of contractsFunctions) {
            await truffleAssert.fails(
                element(accounts[0], 12345, '14/08/2022').send({ from: accounts[1], gas: '25000000' }),
                truffleAssert.ErrorType.REVERT
            )
        }
    })

    it('sees if getCheckIns and getCheckOuts returns the correct value and the correct amount of elements', async () => {
        const contractsFunctions = [
            accessCampus.methods.getCheckIns('14/08/2022'),
            accessCampus.methods.getCheckOuts('14/08/2022'),
        ]
        for (let i = 0; i < contractsFunctions.length; i++) {
            // let resul = await contractsFunctions[i].send({ from: accounts[0], gas: '25000000' })
            // let resulAddress = JSON.parse(JSON.stringify(resul.events.getCheck.returnValues))[0][0][0]
            // let resulTime = JSON.parse(JSON.stringify(resul.events.getCheck.returnValues))[0][0][1]
            // let resulAmount = JSON.parse(JSON.stringify(resul.events.getCheck.returnValues))[0].length
            // assert.equal(resulAddress, accounts[0])
            // assert.equal(resulTime, 12345)
            // assert.equal(resulAmount, 1)
            let objectsReturns = []
            let returnValues = await contractsFunctions[i].call({ from: accounts[0] })
            returnValues.map((object) => {
                objectsReturns.push(decoder.createObject('accessCampus', 'getCheckIns', [object[0], object[1]]))
            })
            assert.equal(objectsReturns[0].userAddress, accounts[0])
            assert.equal(objectsReturns[0].time, 12345)
            assert.equal(objectsReturns.length, 1)
        }
    })

    it('checks error "not owner" in getCheckIns and getCheckOuts', async () => {
        const contractsFunctions = [
            accessCampus.methods.getCheckIns('14/08/2022'),
            accessCampus.methods.getCheckOuts('14/08/2022'),
        ]
        for (let i = 0; i < contractsFunctions.length; i++) {
            await truffleAssert.fails(
                contractsFunctions[i].send({ from: accounts[1], gas: '25000000' }),
                truffleAssert.ErrorType.REVERT
            )
        }
    })
})
