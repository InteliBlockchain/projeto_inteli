const axios = require('axios')
const { lectureFactory, person, inteliFactory } = require('../utils/ethers')

const { createHash } = require('crypto')

const { connectToDatabase } = require('../database')
const { storeNFT } = require('../ethereum/apis/nftStorage')

class Lecture {
    async createLecture(file, lectureName, ras, description) {
        const inteliFactoryInstance = await inteliFactory()
        const lectureFactoryInstance = await lectureFactory()

        const wallets = []
        const rasWithoutWallet = []

        for (let i = 0; i < ras.length; i++) {
            // Get de todas as wallets a partir do Array da Ras
            const wallet = await inteliFactoryInstance.getWallet(ras[i])

            // Checar se a wallet existe
            if (wallet != '0x0000000000000000000000000000000000000000') {
                // Adicionar a wallet ao array
                wallets.push(wallet)
            } else {
                rasWithoutWallet.push(ras[i])
            }
        }
        // caso algum dos RAs passados não corresponda a uma carteira:
        if (rasWithoutWallet.length > 0) {
            const formatedRasWithoutWallet = rasWithoutWallet.join(', ')
            throw new Error("Erro! Não encontradas carteiras para os seguintes R.A's: " + formatedRasWithoutWallet)
        }

        // Conectar ao banco de dados
        const db = await connectToDatabase()

        // Hashear lecture name
        const nameHash = createHash('sha256').update(lectureName).digest('hex')

        // Armazenar no banco de dados
        await db.run(`INSERT INTO lecture (name, nameHash) VALUES ('${lectureName}', '${nameHash}')`)

        // Fechar o banco de dados
        await db.close()

        // Criar nova NFT no NFT Storage (devolve url)
        const result = await storeNFT(file, nameHash, description)
        const parsedResult = JSON.parse(JSON.stringify(result))

        // Get da url e executa função createLecture do contrato LectureFactory
        const newLecture = await lectureFactoryInstance.createLecture(wallets, parsedResult.url)
        const confirmedNewLecture = await newLecture.wait()

        const event = confirmedNewLecture.events.find((event) => event.event == 'NewLecture')
        const [address] = event.args

        // Executa a função newActivity do contrato Person para cada usuário que foi na palestra
        for (let i = 0; i < ras.length; i++) {
            const personInstance = await person(ras[i])
            await personInstance.newActivity('lecture', address)
        }
    }

    async getLecturesStudent(ra) {
        const inteliFactoryInstance = await inteliFactory()
        const personInstance = await person(ra)
        // Conectar ao banco de dados
        const db = await connectToDatabase()

        // Executa a função getWallet do contrato inteliFactory
        const wallet = await inteliFactoryInstance.getWallet(ra)

        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Wallet não encontrada para esse RA')
        }

        // Executa a função getActivities do contrato Person
        const lecturesAdresses = await personInstance.getActivities('lecture')

        const lecturesMetadata = []

        for (let i = 0; i < lecturesAdresses.length; i++) {
            const lectureInstance = await lecture(lecturesAdresses[i])
            const ipfsLink = await lectureInstance.uri(0)
            const formatedIpfsLink = 'https://ipfs.io/ipfs/' + ipfsLink.slice(7)
            const { data: metadata } = await axios.get(formatedIpfsLink)

            if (metadata) {
                const lectureFromDb = await db.get(`SELECT * FROM lecture WHERE nameHash='${metadata.name}'`)

                if (lectureFromDb) {
                    metadata.name = lectureFromDb.name
                    lecturesMetadata.push(metadata)
                }
            }
        }

        // Fechar o banco de dados
        await db.close()

        return lecturesMetadata
    }

    async getLectures() {
        const lectureFactoryInstance = await lectureFactory()
        // Conectar ao banco de dados
        const db = await connectToDatabase()

        const lectures = await lectureFactoryInstance.viewLectures()
        const lecturesMetadata = []

        for (let i = 0; i < lectures.length; i++) {
            const lectureInstance = await lecture(lectures[i])
            const ipfsLink = await lectureInstance.uri(0)
            const formatedIpfsLink = 'https://ipfs.io/ipfs/' + ipfsLink.slice(7)
            const { data: metadata } = await axios.get(formatedIpfsLink)

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

        // Fechar o banco de dados
        await db.close()

        return lecturesMetadata
    }
}

module.exports = {
    Lecture,
}
