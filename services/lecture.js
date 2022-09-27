const axios = require('axios')
// Compiled smart contracts
const { lectureFactory, person, lecture, inteliFactory, blockchainConnection } = require('../utils/ethers')

const { createHash } = require('crypto')

const { connectToDatabase } = require('../database')
const { storeNFT } = require('../ethereum/apis/nftStorage')
const {
    lectureFactory,
} = require('../utils/ethers')

class Lecture {

    async createLecture() {
        //Código Aqui
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

        for (let i = 1; i <= currentNFTid; i++){
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

    async changeURI() {
        //Código Aqui
    }
}

module.exports = {
    Lecture,
}
