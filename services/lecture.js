const axios = require('axios')
// Compiled smart contracts
const { lectureFactory, inteliFactory } = require('../utils/ethers')
const { walletDoesNotExistsValidation } = require('../utils/validation')

const { storeNFT } = require('../utils/apis/nftStorage')
const { encryptLecture, decodeLecture } = require('../utils/encrypt')

const { ethers } = require('ethers')

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
        const formatedId = ethers.BigNumber.from(currentId).toNumber()

        let lectures = []

        for (let i = 0; i < formatedId; i++) {
            const uri = await lectureFactoryInstance.uri(i)
            if (uri === '') {
                throw new Error(`Nenhuma uri para o id ${i}`)
            } else {
                const formatedIpfsLink = 'https://ipfs.io/ipfs/' + uri.slice(7)
                const { data: NFTMetaDado } = await axios.get(formatedIpfsLink)
                const decodedName = decodeLecture(NFTMetaDado.name)
                lectures.push({
                    lectureName: decodedName,
                    lectureId: i,
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

    async getLecturesStudent(ra) {
        const inteliFactoryInstance = await inteliFactory()
        const address = inteliFactoryInstance.getWallet(ra)
        walletDoesNotExistsValidation(address)

        const lectureFactoryInstance = await lectureFactory()
        const currentNFTid = await lectureFactoryInstance._tokenIds()
        const formatedNumber = ethers.BigNumber.from(currentNFTid).toNumber()

        let arrayIds = []
        let arrayAddress = []

        for (let i = 0; i < formatedNumber; i++) {
            arrayIds.push(i)
        }

        for (let i = 0; i < arrayIds.length; i++) {
            arrayAddress.push(address)
        }

        if (arrayIds.length == 0 || arrayAddress.length == 0) {
            throw new Error('Array não completo')
        }

        const amount = await lectureFactoryInstance.balanceOfBatch(arrayAddress, arrayIds)
      
        let lectures = await this.getLectures()
      
        for (let i = 0; i < amount.length; i++) {
            const currentLecture = ethers.BigNumber.from(amount[i]).toNumber()

            if (currentLecture === 1) {
                lectures[i] = { ...lectures[i], attendance: true }
            } else if (currentLecture === 0) {
                lectures[i] = { ...lectures[i], attendance: false }
            } else {
                throw new Error(`Quantidade para a palestra de id ${i} não encontrado`)
            }
        }

        return lectures
    }
}

module.exports = {
    Lecture,
}
