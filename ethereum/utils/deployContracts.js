//npm modules
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { web3 } = require('./web3')

// Compiled smart contracts
const compiledInteliFactory = require('../artifacts/ethereum/contracts/InteliFactory.sol/InteliFactory.json')
const compiledAccessCampus = require('../artifacts/ethereum/contracts/AccessCampus.sol/AccessCampus.json')
const compiledLectureFactory = require('../artifacts/ethereum/contracts/LectureFactory.sol/LectureFactory.json')

const fs = require('fs')

// Setup rinkeby account
const provider = new HDWalletProvider(
    'prefer output citizen artwork major aunt moment hero spot asthma quick report',
    'https://rinkeby.infura.io/v3/ce4c9d4f09204bf58decc5edbffe4d38'
)

// Array with contracts' name and address
let contractsAdresses = {}

// Setup contracts' deployment
const deployContract = async (contractName, compiledContract) => {
    try {
        const accounts = await web3.eth.getAccounts()

        const result = await new web3.eth.Contract(compiledContract.abi)
            .deploy({ data: compiledContract.bytecode })
            .send({ gas: '25000000', from: accounts[0] })

        console.log('Contract deployed to', result.options.address)
        provider.engine.stop()

        contractsAdresses[contractName] = result.options.address

        return result.options.address
    } catch (err) {
        console.log(err)
    }
}

;(async () => {
    // Calling the function to deploy each contract
    await deployContract('InteliFactory', compiledInteliFactory)
    await deployContract('AccessCampus', compiledAccessCampus)
    await deployContract('LectureFactory', compiledLectureFactory)

    fs.readFile(__dirname + '/contractsAddresses.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err)
            return
        }

        const newJson = JSON.parse(data) //now it an object
        newJson.addresses.push(contractsAdresses) //add some data

        // Create Json with Addresses
        const jsonAddressObject = JSON.stringify(newJson)

        fs.writeFile(__dirname + '/contractsAddresses.json', jsonAddressObject, 'utf8', (err) => {
            if (err) {
                console.log(err)
                return
            }

            console.log('Arquivo com endereço de contratos criados')
            return
        })
    })
})()
