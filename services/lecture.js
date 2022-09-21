const {
    lectureFactory,
    person,
    lecture,
} = require('../utils/ethers')

const { createHash, randomBytes } = require('crypto')
const { promisify } = require('util')
const randomBytesAsync = promisify(randomBytes)

const { connectToDatabase } = require('../database')
const { storeNFT } = require('../ethereum/apis/nftStorage')
const fs = require('fs').promises

//database infos:
//table: "lecture" -> id(PK), name, nameHash

function getKey(size) {
    return randomBytesAsync(size)
}

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

        // Gerar Hash aleatória
        const hash = await getKey(16)

        // Criar nome de arquivo que não se repete
        const fileName = `${hash.toString('hex')}-${file.originalname}`
        const filePath = __dirname + '/../tmp/' + fileName

        // Armazenar arquivo na pasta tmp
        await fs.writeFile(filePath, file.buffer)

        // Criar nova NFT no NFT Storage (devolve url)
        const result = await storeNFT(filePath, nameHash, description)
        const parsedResult = JSON.parse(JSON.stringify(result))

        // Deletar o arquivo criado
        await fs.unlink(filePath)

        // Get da url e executa função createLecture do contrato LectureFactory
        const newLectureAddress = JSON.parse(
            JSON.stringify(
                await lectureFactoryInstance.createLecture(wallets, parsedResult.url).events.NewLecture.returnValues
            )
        )[0]

        // Executa a função newActivity do contrato Person para cada usuário que foi na palestra
        for (let i = 0; i < ras.length; i++) {
            const personInstance = await person(ras[i])
            await personInstance.newActivity('lecture', newLectureAddress)
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
            const response = await fetch(formatedIpfsLink)
            const metadata = await response.json()
            const lectureFromDb = await db.get(`SELECT * FROM lecture WHERE nameHash='${metadata.name}'`)
            metadata.name = lectureFromDb.name
            lecturesMetadata.push(metadata)
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
            const response = await fetch(formatedIpfsLink)
            const metadata = await response.json()
            const lectureFromDb = await db.get(`SELECT * FROM lecture WHERE nameHash='${metadata.name}'`)
            metadata.name = lectureFromDb.name
            lecturesMetadata.push(metadata)

            const lecturePeople = await lectureInstance.returnPeople()

            const studentRas = []

            for (let y = 0; y < lecturePeople.length; y++) {
                const ra = await inteliFactoryInstance.getStudent(lecturePeople[y])
                studentRas.push(ra)
            }
            metadata.students = studentRas
        }

        // Fechar o banco de dados
        await db.close()

        return lecturesMetadata
    }
}

module.exports = {
    Lecture,
}
