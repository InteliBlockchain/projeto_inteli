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
let lectureFactory
let accessCampus
let newLecture
let lectureAddress

//test setup
beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    inteliFactory = await new web3.eth.Contract(compiledInteliFactory.abi)
        .deploy({ data: compiledInteliFactory.bytecode })
        .send({ from: accounts[0], gas: '25000000' })

    lectureFactory = await new web3.eth.Contract(compiledLectureFactory.abi)
        .deploy({ data: compiledLectureFactory.bytecode })
        .send({ from: accounts[0], gas: '25000000' })

    newLecture = await lectureFactory.methods
        .createLecture([accounts[0]], '')
        .send({ from: accounts[0], gas: '25000000' })

    newLectureAddress = JSON.parse(JSON.stringify(newLecture.events.NewLecture.returnValues))[0]
    console.log(newLectureAddress)

    accessCampus = await new web3.eth.Contract(compiledAccessCampus.abi)
        .deploy({ data: compiledAccessCampus.bytecode })
        .send({ from: accounts[0], gas: '25000000' })
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
        assert(await inteliFactory.methods.createStudent('A2022.1A.0XXX').send({ from: accounts[0], gas: '2500000' }))
    })

  it("deletes a student", async () => {
    await inteliFactory.methods
      .createStudent("A2022.1A.0XXX")
      .send({ from: accounts[0], gas: "2500000" });

    assert(
      await inteliFactory.methods
        .removeStudent("A2022.1A.0XXX")
        .send({ from: accounts[0], gas: "2500000" })
    );
  });

  it("deletes a student", async () => {
    await inteliFactory.methods
      .createStudent("A2022.1A.0XXX")
      .send({ from: accounts[0], gas: "2500000" });

    assert(
      await inteliFactory.methods
        .removeStudent("A2022.1A.0XXX")
        .send({ from: accounts[0], gas: "2500000" })
    );
  });
});

//test lectureFactory
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
                .createLecture([accounts[0]], '')
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
