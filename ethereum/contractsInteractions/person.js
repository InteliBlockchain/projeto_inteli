//project module
const {web3} = require('../utils/web3')
//compiled smart contract
const compiledPerson = require('../artifacts/ethereum/contracts/Person.sol/Person.json')

const instance = (address) => {
    return new web3.eth.Contract(compiledPerson.abi, address)
}

module.exports = {
    instance,
}
