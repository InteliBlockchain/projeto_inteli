const axios = require('axios')
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
