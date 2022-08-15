//built-in module
const assert = require('assert')
//npm modules
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const truffleAssert = require('truffle-assertions')
//compiled smart contracts
const compiledPerson = require('../ethereum/artifacts/ethereum/contracts/Person.sol/Person.json')
const compiledInteliFactory = require('../ethereum/artifacts/ethereum/contracts/InteliFactory.sol/InteliFactory.json')

//reusable variables
let accounts
let inteliFactory
let person
let personAddress
let personInstance

//test setup
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    web3.eth.handleRevert = true

    inteliFactory = await new web3.eth.Contract(compiledInteliFactory.abi)
        .deploy({ data: compiledInteliFactory.bytecode })
        .send({ from: accounts[0], gas: '25000000' })

    await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' })

    personAddress = await inteliFactory.methods.getArrStudent().call({ from: accounts[0] })

    personInstance = new web3.eth.Contract(compiledPerson.abi, personAddress[personAddress.length - 1])

    await personInstance.methods.newActivity('Palestras', accounts[0]).send({ from: accounts[0], gas: '2500000' })
    //deploying accessCampus and its children
})

describe('factory tests', async () => {
    it('sees if the owner was correctly set', async () => {
        let inteliFactoryOwner = await inteliFactory.methods.owner().call()
        let personOwner = await personInstance.methods.owner().call()
        assert.equal(inteliFactoryOwner, personOwner)
    })

    it('checks registrer checkIn and getCheckIn', async () => {
        await personInstance.methods.registerCheckIn('22/08', 12345).send({
            from: accounts[0],
            gas: '2500000',
        })
        let checkIns = await personInstance.methods.getCheckIn('22/08').call({
            from: accounts[0],
        })
        checkIns = checkIns[checkIns.length - 1]
        assert.equal(checkIns, 12345)
    })

    it('"not owner" error in registrer checkIn and getCheckIn', async () => {
        await truffleAssert.fails(
            personInstance.methods.registerCheckIn('22/08', 12345).send({
                from: accounts[1],
                gas: '2500000',
            }),
            truffleAssert.ErrorType.REVERT
        )
        await truffleAssert.fails(
            personInstance.methods.getCheckIn('22/08').call({
                from: accounts[1],
            }),
            truffleAssert.ErrorType.REVERT
        )
    })

    it('checks registrer checkOut and getCheckOut', async () => {
        await personInstance.methods.registerCheckOut('22/08', 12345).send({
            from: accounts[0],
            gas: '2500000',
        })
        let checkOuts = await personInstance.methods.getCheckOut('22/08').call({
            from: accounts[0],
        })
        checkOuts = checkOuts[checkOuts.length - 1]
        assert.equal(checkOuts, 12345)
    })

    it('"not owner" error in registrer checkOut and getCheckOut', async () => {
        await truffleAssert.fails(
            personInstance.methods.registerCheckOut('22/08', 12345).send({
                from: accounts[1],
                gas: '2500000',
            }),
            truffleAssert.ErrorType.REVERT
        )
        await truffleAssert.fails(
            personInstance.methods.getCheckOut('22/08').call({
                from: accounts[1],
            }),
            truffleAssert.ErrorType.REVERT
        )
    })

    it('checks registrer newActivity', async () => {
        assert.ok(
            await personInstance.methods.newActivity('Palestras', accounts[0]).send({
                from: accounts[0],
                gas: '2500000',
            })
        )
    })

    it('"not owner" error in registrer newActivity', async () => {
        await truffleAssert.fails(
            personInstance.methods.newActivity('Palestras', accounts[0]).send({
                from: accounts[1],
                gas: '2500000',
            }),
            truffleAssert.ErrorType.REVERT
        )
    })

    it('checks if getActivities returns the correct value', async () => {
        let activityAddress = await personInstance.methods.getActivities('Palestras').call({ from: accounts[0] })
        activityAddress = activityAddress[activityAddress.length - 1]
        assert.equal(activityAddress, accounts[0])
    })

    it('"not owner" error in getActivities', async () => {
        await truffleAssert.fails(
            personInstance.methods.getActivities('Palestras').call({ from: accounts[1] }),
            truffleAssert.ErrorType.REVERT
        )
    })

    it('checks if eraseMe does`s thrown an error', async () => {
        assert.ok(
            await personInstance.methods.eraseMe().send({
                from: accounts[0],
                gas: '2500000',
            })
        )
    })

    it('"not owner" error in eraseMe', async () => {
        await truffleAssert.fails(
            personInstance.methods.eraseMe().send({
                from: accounts[1],
                gas: '2500000',
            }),
            truffleAssert.ErrorType.REVERT
        )
    })
})
