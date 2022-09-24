<<<<<<< Updated upstream
const {
    lectureFactory,
    person,
    lecture,
} = require('../utils/ethers')
=======
const { web3 } = require('../ethereum/utils/web3')
// Compiled smart contract
const { instance: lectureFactory } = require('../ethereum/contractsInteractions/lectureFactory')
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')
const { instance: person } = require('../ethereum/contractsInteractions/person')
const { instance: lecture } = require('../ethereum/contractsInteractions/lecture')
>>>>>>> Stashed changes

const { createHash } = require('crypto')

const { connectToDatabase } = require('../database')
const { storeNFT } = require('../ethereum/apis/nftStorage')

class Lecture {
    async createLecture(file, lectureName, ras, description) {
<<<<<<< Updated upstream
        const inteliFactoryInstance = await inteliFactory()
        const lectureFactoryInstance = await lectureFactory()

=======
        // Get the Inteli wallet
        const accounts = await web3.eth.getAccounts()

        // Get of all wallets from the RAs Array
>>>>>>> Stashed changes
        const wallets = []
        const rasWithoutWallet = []

        for (let i = 0; i < ras.length; i++) {
            // Get de todas as wallets a partir do Array da Ras
            const wallet = await inteliFactoryInstance.getWallet(ras[i])

            // Check if the wallet exists
            if (wallet != '0x0000000000000000000000000000000000000000') {
                // Add the wallet to the array
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
        const newLectureAddress = JSON.parse(
            JSON.stringify(
                await lectureFactoryInstance.createLecture(wallets, parsedResult.url).events.NewLecture.returnValues
            )
        )[0]

<<<<<<< Updated upstream
        // Executa a função newActivity do contrato Person para cada usuário que foi na palestra
        for (let i = 0; i < ras.length; i++) {
            const personInstance = await person(ras[i])
            await personInstance.newActivity('lecture', newLectureAddress)
=======
        // Execute the newActivity function of the Person contract for each user that went to the event
        for (let i = 0; i < wallets.length; i++) {
            await person(wallets[i]).methods.newActivity('lecture', newLectureAddress).send({ from: accounts[0] })
>>>>>>> Stashed changes
        }
    }

    async getLecturesStudent(ra) {
<<<<<<< Updated upstream
        const inteliFactoryInstance = await inteliFactory()
        const personInstance = await person(ra)
        // Conectar ao banco de dados
        const db = await connectToDatabase()

        // Executa a função getWallet do contrato inteliFactory
        const wallet = await inteliFactoryInstance.getWallet(ra)
=======
        const accounts = await web3.eth.getAccounts()

        // Connect to the Database
        const db = await connectToDatabase()

        // Execute the getWallet function of the contract inteliFactory
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })
>>>>>>> Stashed changes

        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Wallet não encontrada para esse RA')
        }

<<<<<<< Updated upstream
        // Executa a função getActivities do contrato Person
        const lecturesAdresses = await personInstance.getActivities('lecture')
=======
        // Execute the getActivities function of the Person contract
        const lecturesAdresses = await person(wallet).methods.getActivities('lecture').call({
            from: accounts[0],
        })
>>>>>>> Stashed changes

        const lecturesMetadata = []

        for (let i = 0; i < lecturesAdresses.length; i++) {
            const lectureInstance = await lecture(lecturesAdresses[i])
            const ipfsLink = await lectureInstance.uri(0)
            const formatedIpfsLink = 'https://ipfs.io/ipfs/' + ipfsLink.slice(7)
            const response = await fetch(formatedIpfsLink)
            const metadata = await response.json()
            
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

    async getLectures() {
<<<<<<< Updated upstream
        const lectureFactoryInstance = await lectureFactory()
        // Conectar ao banco de dados
=======
        // Connect to Database
>>>>>>> Stashed changes
        const db = await connectToDatabase()

        const lectures = await lectureFactoryInstance.viewLectures()
        const lecturesMetadata = []

        for (let i = 0; i < lectures.length; i++) {
            const lectureInstance = await lecture(lectures[i])
            const ipfsLink = await lectureInstance.uri(0)
            const formatedIpfsLink = 'https://ipfs.io/ipfs/' + ipfsLink.slice(7)
            const response = await fetch(formatedIpfsLink)
            const metadata = await response.json()

            if (metadata) {
                const lectureFromDb = await db.get(`SELECT * FROM lecture WHERE nameHash='${metadata.name}'`)

                if (lectureFromDb) {
                    metadata.name = lectureFromDb.name
                    lecturesMetadata.push(metadata)

                    const lecturePeople = await lecture(lectures[i]).methods.returnPeople().call({ from: accounts[0] })

                    const studentRas = []

                    for (let y = 0; y < lecturePeople.length; y++) {
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
