//npm module
const { web3 } = require('./../utils/web3')
//compiled smart contract
const inteliFactory = require('./build/InteliFactory.json')

//pass address of the 'factory' to web3
//TODO: declare address as ENV variable
const instance = new web3.eth.Contract(inteliFactory.abi, '0xEC2176331a7ff053309d074888e2b30d83531d88')

module.exports = {
    instance,
}
