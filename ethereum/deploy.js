//npm modules
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { web3 } = require('./web3')
//compiled smart contracts
const compiledInteliFactory = require('./artifacts/ethereum/contracts/InteliFactory.sol/InteliFactory.json')
const compiledAccessCampus = require('./artifacts/ethereum/contracts/AccessCampus.sol/AccessCampus.json')
const compiledLectureFactory = require('./artifacts/ethereum/contracts/LectureFactory.sol/LectureFactory.json')

//setup rinkeby account
const provider = new HDWalletProvider(
    'prefer output citizen artwork major aunt moment hero spot asthma quick report',
    'https://rinkeby.infura.io/v3/ce4c9d4f09204bf58decc5edbffe4d38'
)

//array with contracts' name and address
let contractsAddress = []

//setup contracts' deployment
const deployContract = async (contractName, compiledContract) => {
    try {
        const accounts = await web3.eth.getAccounts()

        const result = await new web3.eth.Contract(compiledContract.abi)
            .deploy({ data: compiledContract.bytecode })
            .send({ gas: '25000000', from: accounts[0] })

        console.log('Contract deployed to', result.options.address)
        provider.engine.stop()
        contractsAddress.push({
            name: contractName,
            contractAddress: result.options.address,
        })
        return result.options.address
    } catch (err) {
        console.log(err)
    }
}
//calling the function to deploy each contract
deployContract('InteliFactory', compiledInteliFactory)
deployContract('AccessCampus', compiledAccessCampus)
deployContract('LectureFactory', compiledLectureFactory)

//module.exports = { deployFactory, deployContract };
