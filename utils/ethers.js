const { walletDoesNotExistsValidation } = require('./validation')

const { ethers } = require('ethers')
const { abi: inteliFactoryAbi } = require('../build/contracts/InteliFactory.json')
const { abi: lectureFactoryAbi } = require('../build/contracts/LectureFactory.json')
const { abi: accessCampusAbi } = require('../build/contracts/AccessCampus.json')
// const { abi: lectureAbi } = require('../build/contracts/Lecture.json')
const { abi: personAbi } = require('../build/contracts/Person.json')

const { addresses } = require('../contractsAddresses.json')

const blockchainConnection = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_URL, parseInt(process.env.BLOCKCHAIN_CHAIN_ID))
    const signer = provider.getSigner(process.env.BLOCKCHAIN_ACCOUNT_ADDRESS)
    await signer.unlock(process.env.BLOCKCHAIN_ACCOUNT_PASSWORD)

    return {
        provider,
        signer,
    }
}

const inteliFactory = async () => {
    const { provider, signer } = await blockchainConnection()
    const inteliFactory = new ethers.Contract(addresses.at(-1).InteliFactory, inteliFactoryAbi, provider)
    const inteliFactoryInstance = inteliFactory.connect(signer)

    return inteliFactoryInstance
}

const lectureFactory = async () => {
    const { provider, signer } = await blockchainConnection()

    const lectureFactory = new ethers.Contract(addresses.at(-1).LectureFactory, lectureFactoryAbi, provider)
    const lectureFactoryInstance = lectureFactory.connect(signer)

    return lectureFactoryInstance
}

const accessCampus = async () => {
    const { provider, signer } = await blockchainConnection()

    const accessCampus = new ethers.Contract(addresses.at(-1).AccessCampus, accessCampusAbi, provider)
    const accessCampusInstance = accessCampus.connect(signer)

    return accessCampusInstance
}

const person = async (ra) => {
    const inteliFactoryInstance = await inteliFactory()
    const personAddress = await inteliFactoryInstance.getWallet(ra)
    
    walletDoesNotExistsValidation(personAddress)

    const { provider, signer } = await blockchainConnection()

    const person = new ethers.Contract(personAddress, personAbi, provider)
    const personInstance = person.connect(signer)
    
    return personInstance
}

// const lecture = async (addrs) => {
//     const { provider, signer } = await blockchainConnection()

//     const lecture = new ethers.Contract(addrs, lectureAbi, provider)
//     const lectureInstance = lecture.connect(signer)

//     return lectureInstance
// }

module.exports = {
    blockchainConnection,
    inteliFactory,
    lectureFactory,
    accessCampus,
    person,
}
