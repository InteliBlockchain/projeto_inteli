// var InteliFactory = artifacts.require('./InteliFactory.sol')
// var AccessCampus = artifacts.require('./AccessCampus.sol')
// var LectureFactory = artifacts.require('./LectureFactory.sol')

// module.exports = function (deployer) {
//     deployer.deploy(InteliFactory)
//     deployer.deploy(AccessCampus)
//     deployer.deploy(LectureFactory)
// }

// ***********************************************************

var InteliFactory = artifacts.require('./InteliFactory.sol')
var LectureFactory = artifacts.require('./LectureFactory.sol')
var AccessCampus = artifacts.require('./AccessCampus.sol')
const fs = require('fs').promises

module.exports = async function (deployer) {
    try {
        // Array with contracts' name and address
        let contractsAddresses = {}

        await deployer.deploy(InteliFactory)
        await deployer.deploy(AccessCampus)
        await deployer.deploy(LectureFactory)

        contractsAddresses['InteliFactory'] = InteliFactory.address
        contractsAddresses['AccessCampus'] = AccessCampus.address
        contractsAddresses['LectureFactory'] = LectureFactory.address

        await writeAddresses(contractsAddresses)
    } catch (err) {
        console.log(err)
    }
}

const writeAddresses = async (contractsAddresses) => {
    const data = await fs.readFile(__dirname + '/../contractsAddresses.json', 'utf8')

    const newJson = JSON.parse(data) //now it an object
    newJson.addresses.push(contractsAddresses) //add some data

    // Create Json with Addresses
    const jsonAddressObject = JSON.stringify(newJson)

    await fs.writeFile(__dirname + '/../contractsAddresses.json', jsonAddressObject, 'utf8')
    console.log('Arquivo com endereço de contratos criados')
}
