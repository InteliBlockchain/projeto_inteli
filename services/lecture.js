const { web3 } = require('../ethereum/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/factory')

class Student {
    async createLecture(lectureName, ras) {
        //Código aqui
    }

    async getLecturesStudent(ra) {
        //Código aqui
    }

    async getLectures() {
        //Código aqui
    }
}

module.exports = {
    Student,
}
