const { web3 } = require('../ethereum/utils/web3')
//compiled smart contract
const { instance: lectureFactory } = require('../ethereum/contractsInteractions/lectureFactory')
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')
const { instance: person } = require('../ethereum/contractsInteractions/person')
const { instance: lecture } = require('../ethereum/contractsInteractions/lecture')

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
        // Get de wallet do Inteli
        const accounts = await web3.eth.getAccounts()

        // Get de todas as wallets a partir do Array da Ras
        const wallets = []
        const rasWithoutWallet = []

        for (let i = 0; i < ras.length; i++) {
            const wallet = await inteliFactory.methods.getWallet(ras[i]).call({ from: accounts[0] })

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
                (await lectureFactory.methods.createLecture(wallets, parsedResult.url).send({ from: accounts[0] }))
                    .events.NewLecture.returnValues
            )
        )[0]

        // Executa a função newActivity do contrato Person para cada usuário que foi na palestra
        for (let i = 0; i < wallets.length; i++) {
            await person(wallets[i]).methods.newActivity('lecture', newLectureAddress).send({ from: accounts[0] })
        }
    }

    async getLecturesStudent(ra) {
        const accounts = await web3.eth.getAccounts()

        // Conectar ao banco de dados
        const db = await connectToDatabase()

        // Executa a função getWallet do contrato inteliFactory
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })

        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Wallet não encontrada para esse RA')
        }

        // Executa a função getActivities do contrato Person
        const lecturesAdresses = await person(wallet).methods.getActivities('lecture').call({
            from: accounts[0],
        })

        const lecturesMetadata = []

        for (let i = 0; i < lecturesAdresses.length; i++) {
            const ipfsLink = await lecture(lecturesAdresses[i]).methods.uri(0).call({ from: accounts[0] })
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
        // Conectar ao banco de dados
        const db = await connectToDatabase()

        const accounts = await web3.eth.getAccounts()
        const lectures = await lectureFactory.methods.viewLectures().call({ from: accounts[0] })

        const lecturesMetadata = []

        for (let i = 0; i < lectures.length; i++) {
            const ipfsLink = await lecture(lectures[i]).methods.uri(0).call({ from: accounts[0] })
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
}

module.exports = {
    Lecture,
}
