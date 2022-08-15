//project module
const { web3 } = require('../utils/web3')
//compiled smart contract
const compiledLecture = require('../artifacts/ethereum/contracts/Lecture.sol/Lecture.json')

const instance = (address) => {
    return new web3.eth.Contract(compiledLecture.abi, address)
}

module.exports = {
    instance,
}
