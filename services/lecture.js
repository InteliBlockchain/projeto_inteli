const axios = require('axios')
// Compiled smart contracts
const { lectureFactory, person, lecture, inteliFactory, blockchainConnection } = require('../utils/ethers')

const { createHash } = require('crypto')

const { connectToDatabase } = require('../database')
const { storeNFT } = require('../ethereum/apis/nftStorage')

class Lecture {

    async createLecture() {
        //Código Aqui
    }

    async burnNFT() {
        //Código Aqui

    }

    // Get all the lectures
    async getLectures() {

        //Código Aqui
    }


    async getLectureRas() {
        //Código Aqui
    }

    async getLecturesStudent() {
        //Código Aqui
    }

    async changeURI() {
        //Código Aqui
    }
}

module.exports = {
    Lecture,
}
