//project module
const {web3} = require('../utils/web3')
//compiled smart contract
const compiledPerson = require('../artifacts/ethereum/contracts/Person.sol/Person.json')

//pass address of the 'contract' to web3
//TODO: declare address as ENV variable
const instance = (address) => {
    return new web3.eth.Contract(compiledPerson.abi, address)
}

module.exports = {
    instance,
}
