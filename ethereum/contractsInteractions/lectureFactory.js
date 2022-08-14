//npm module
const { web3 } = require('./../utils/web3')
//compiled smart contract
const lectureFactory = require('../artifacts/ethereum/contracts/LectureFactory.sol/LectureFactory.json')

//get deployed contracts' adresses object
const contractsAdresses = require('../utils/contractsAddresses.json')

//pass address of the 'factory' to web3
//TODO: declare address as ENV variable
const instance = new web3.eth.Contract(lectureFactory.abi, contractsAdresses.addresses.at(-1).LectureFactory)

module.exports = {
    instance,
}
