const axios = require('axios')
// Compiled smart contracts
const { lectureFactory, inteliFactory } = require('../utils/ethers')

const { storeNFT } = require('../ethereum/apis/nftStorage')
const { encryptLecture, desencryptLecture } = require('../utils/encrypt')

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

        const { hashedName } = encryptLecture(lectureName)

        // Criar nova NFT no NFT Storage (devolve url)
        const result = await storeNFT(file, hashedName, description)
        const parsedResult = JSON.parse(JSON.stringify(result))

        // Get da url e executa função createLecture do contrato LectureFactory
        const newLecture = await lectureFactoryInstance.createLecture(wallets, parsedResult.url)
        await newLecture.wait()
    }

    async burnNFT(addresses) {
        const lectureFactoryInstance = await lectureFactory()

        for (let i = 0; i < addresses.length; i++) {
            await lectureFactoryInstance.burnNFT(addresses[i])
        }
    }

    // Get all the lectures
    async getLectures() {
        const lectureFactoryInstance = await lectureFactory()
        const currentId = await lectureFactoryInstance._tokenIds()
        let lectures = []

        for (let i = 0; i < currentId ; i++) {
            const uri = await lectureFactoryInstance.uri(i)
            if (uri === "") {
                throw new Error(`Nenhuma uri para o id ${i}`)
            }
            else {
                const formatedIpfsLink =
                'https://ipfs.io/ipfs/' + uri.slice(7)
                const response = await fetch(formatedIpfsLink)
                const NFTMetaDado = await response.json()
                const decodedName = desencryptLecture(NFTMetaDado.name)
                lectures.push({
                    lectureName: decodedName,
                    lectureId: i
                })
            }
        }

        return lectures

    }

    async getLectureRas(NFTid) {
        const lectureFactoryInstance = await lectureFactory()
        const inteliFactoryInstance = await inteliFactory()

        const wallets = await lectureFactoryInstance.owners(NFTid)
        let ras = []

        for (let i = 0; i < ras.length; i++) {
            const ra = await inteliFactoryInstance.getStudent(wallets[i])
            ras.push(ra)
        }

        return ras
    }

    async getLecturesStudent(address) {
        let arrayIds = []
        let arrayAddress = []

        const lectureFactoryInstance = await lectureFactory()
        const currentNFTid = await lectureFactoryInstance.idCount()

        for (let i = 1; i <= currentNFTid; i++) {
            arrayIds.push(i)
        }

        for (i in arrayIds) {
            arrayAddress.push(address)
        }

        if (arrayIds.length == 0 || arrayAddress.length == 0) {
            throw new Error('Array não completo')
        }

        const ammount = await lectureFactoryInstance.balanceOfBatch(arrayAddress, arrayIds)
        let lectures = await this.getLectures()
        for (let i = 0; i < ammount.length; i++) {
            if (ammount[i] === 1) {
                lectures[i] = {...lectures[i], attendance: true}
            }
            else if (ammount[i] === 0) {
                lectures[i] = {...lectures[i], attendance: false}
            }
            else {
                throw new Error(`Quantidade para a palestra de id ${i} não encontrado`)
            }
        }

        return lectures
    }
}

module.exports = {
    Lecture,
}
