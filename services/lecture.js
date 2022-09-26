const axios = require('axios')
// Compiled smart contracts
const { lectureFactory, person, lecture, inteliFactory, blockchainConnection } = require('../utils/ethers')

const { createHash } = require('crypto')

const { connectToDatabase } = require('../database')
const { storeNFT } = require('../ethereum/apis/nftStorage')

class Lecture {
    // Create a new lecture giving it a name and description
    async createLecture(file, lectureName, ras, description) {
        // Instance contracts
        const inteliFactoryInstance = await inteliFactory()
        const lectureFactoryInstance = await lectureFactory()

        const wallets = []
        const rasWithoutWallet = []

        for (let i = 0; i < ras.length; i++) {
            // Get all wallets from the RAs Array
            const wallet = await inteliFactoryInstance.getWallet(ras[i])

            // Check if the wallet exists
            if (wallet != '0x0000000000000000000000000000000000000000') {
                // Add the wallet to wallet array
                wallets.push(wallet)
            } else {
                rasWithoutWallet.push(ras[i])
            }
        }
        // If any of the RAs doesn't match a wallet
        if (rasWithoutWallet.length > 0) {
            const formatedRasWithoutWallet = rasWithoutWallet.join(', ')
            throw new Error("Erro! Não encontradas carteiras para os seguintes R.A's: " + formatedRasWithoutWallet)
        }

        // Connect to Database
        const db = await connectToDatabase()

        // Hash lecture name
        const nameHash = createHash('sha256').update(lectureName).digest('hex')

        // Store in Database
        await db.run(`INSERT INTO lecture (name, nameHash) VALUES ('${lectureName}', '${nameHash}')`)

        // Close the Database
        await db.close()

        // Create a new NFT on NFT Storage (return url)
        const result = await storeNFT(file, nameHash, description)
        const parsedResult = JSON.parse(JSON.stringify(result))

        // Get from the url and execute the createLecture function of the LectureFactory contract
        const newLecture = await lectureFactoryInstance.createLecture(wallets, parsedResult.url)
        const confirmedNewLecture = await newLecture.wait()

        const event = confirmedNewLecture.events.find((event) => event.event == 'NewLecture')
        const [address] = event.args

        // Execute the newActivity function of the Person contract for each user that went to the event
        for (let i = 0; i < ras.length; i++) {
            const personInstance = await person(ras[i])
            await personInstance.newActivity('lecture', address)
        }
    }

    // Get lectures from a student by RA
    async getLecturesStudent(ra) {
        //Instance contract
        const inteliFactoryInstance = await inteliFactory()
        const personInstance = await person(ra)

        // Connect to the Database
        const db = await connectToDatabase()

        // Execute the getWallet function of the contract inteliFactory
        const wallet = await inteliFactoryInstance.getWallet(ra)

        // Check if the wallet exists
        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Wallet não encontrada para esse RA')
        }

        // Execute the getActivities function of the Person contract
        const lecturesAdresses = await personInstance.getActivities('lecture')

        const lecturesMetadata = []

        for (let i = 0; i < lecturesAdresses.length; i++) {
            // Get the lecture adress and connect to a ipfs link
            const lectureInstance = await lecture(lecturesAdresses[i])
            const ipfsLink = await lectureInstance.uri(0)

            // Format the ipfs link
            const formatedIpfsLink = 'https://ipfs.io/ipfs/' + ipfsLink.slice(7)
            const { data: metadata } = await axios.get(formatedIpfsLink)

            // Check if the metadata is true and get lecture from database
            if (metadata) {
                const lectureFromDb = await db.get(`SELECT * FROM lecture WHERE nameHash='${metadata.name}'`)

                if (lectureFromDb) {
                    metadata.name = lectureFromDb.name
                    lecturesMetadata.push(metadata)
                }
            }
        }

        // Close the Database
        await db.close()

        return lecturesMetadata
    }

    // Get all the lectures
    async getLectures() {
        // Instance contract
        const lectureFactoryInstance = await lectureFactory()

        // Connect to Database
        const db = await connectToDatabase()

        const lectures = await lectureFactoryInstance.viewLectures()
        const lecturesMetadata = []

        for (let i = 0; i < lectures.length; i++) {
            // Get the lecture adress and connect to a ipfs link
            const lectureInstance = await lecture(lectures[i])
            const ipfsLink = await lectureInstance.uri(0)

            // Format the ipfs link
            const formatedIpfsLink = 'https://ipfs.io/ipfs/' + ipfsLink.slice(7)
            const { data: metadata } = await axios.get(formatedIpfsLink)

            // Check if the metadata is true and get lecture from database
            if (metadata) {
                const lectureFromDb = await db.get(`SELECT * FROM lecture WHERE nameHash='${metadata.name}'`)

                if (lectureFromDb) {
                    metadata.name = lectureFromDb.name
                    lecturesMetadata.push(metadata)

                    const lecturePeople = await lectureInstance.returnPeople()
                    const studentRas = []

                    for (let y = 0; y < lecturePeople.length; y++) {
                        const inteliFactoryInstance = await inteliFactory()
                        const ra = await inteliFactoryInstance.getStudent(lecturePeople[y])
                        studentRas.push(ra)
                    }
                    metadata.students = studentRas
                }
            }
        }

        // Close the Database
        await db.close()

        return lecturesMetadata
    }
}

module.exports = {
    Lecture,
}
