const axios = require('axios')
// Compiled smart contracts
const { lectureFactory, inteliFactory } = require('../utils/ethers')

const { storeNFT } = require('../ethereum/apis/nftStorage')
const { encryptLecture } = require('../utils/encrypt')

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
        //Código Aqui
    }

    async getLectureRas(NFTid) {
        const lectureFactoryInstance = await lectureFactory()

        const ras = await lectureFactoryInstance.viewLectureOwners(NFTid)

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

        return ammount
    }
}

module.exports = {
    Lecture,
}
