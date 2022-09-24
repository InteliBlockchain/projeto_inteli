//compiled smart contract
const abi = require('../build/contracts/InteliFactory.json')
const { ethers } = require('ethers')

const structDecoder = require('../ethereum/utils/structDecoder')

const contractsAdresses = require('../contractsAddresses.json')

//Import das novas instancias
const { inteliFactory, accessCampus, person, lecture, lectureFactory } = require('../utils/ethers')

// Import novas validacoes
const { walletDoesNotExistsValidation, studentDoesNotExistsValidation } = require('../utils/validation')
const { walletExistsValidation } = require('../utils/validation')

class Student {
    async getStudent(address) {
        const instance = await inteliFactory()
        const student = await instance.getStudent(address)
        studentDoesNotExistsValidation(student)
        return student
    }

    async getWallet(ra) {
        const instance = await inteliFactory()
        const wallet = await instance.getWallet(ra)
        walletDoesNotExistsValidation(wallet)
        return wallet
    }

    async createStudent(ra) {
        const instance = await inteliFactory()
        const wallet = await instance.getWallet(ra)
        walletExistsValidation(wallet, ra)
        await instance.createStudent(ra)
    }

    async removeStudent(ra) {
        const inteliFactoryInstance = await inteliFactory()
        await inteliFactoryInstance.removeStudent(ra)

        const personInstance = await person(ra)
        await personInstance.eraseMe()
    }

    async checkIn(ra, time, date) {
        const personInstance = await person(ra)
        await personInstance.registerCheckIn(date, time)

        const wallet = this.getWallet(ra)
        const accessCampusInstance = await accessCampus()
        await accessCampusInstance.registerCheckIn(wallet, time, date)

    }

    async checkOut(ra, time, date) {
        const personInstance = await person(ra)
        await personInstance.registerCheckOut(date, time)

        
        const wallet = this.getWallet(ra)
        const accessCampusInstance = await accessCampus()
        await accessCampusInstance.registerCheckOut(wallet, time, date)
        
    }

    async accesses(ra, date) {
        const personInstance = await person(ra)
        const accesses = await personInstance.getCheckIn(date)
        const formatedAccesses = accesses.map(bigNumber => ethers.BigNumber.from(bigNumber).toNumber())
        return formatedAccesses
    }

    async exits(ra, date) {
        const personInstance = await person(ra)
        const exits = await personInstance.getCheckOut(date)
        const formatedExits = exits.map(bigNumber => ethers.BigNumber.from(bigNumber).toNumber())

        return formatedExits
    }
    
    async allAccesses(date) {
        const accessCampusInstance = await accessCampus()
        const inteliFactoryInstance = await inteliFactory()

        const wallets = await accessCampusInstance.getCheckIns(date)

        if (wallets.length == 0) {
            return 'Nenhuma entrada registrada nesse dia'
        }

        let decodedStructs = wallets.map((object) =>
            structDecoder.createObject('accessCampus', 'getCheckIns', [object[0], object[1]])
        )

        for (let i = 0; i < decodedStructs.length; i++) {
            const ra = await inteliFactoryInstance.getStudent(decodedStructs[i].userAddress)
            decodedStructs[i] = {
                ra,
                ...decodedStructs[i],
            }
            delete decodedStructs[i].userAddress
        }

        return decodedStructs
    }

    async allExits(date) {
        const accessCampusInstance = await accessCampus()
        const inteliFactoryInstance = await inteliFactory()

        const wallets = await accessCampusInstance.getCheckOuts(date)

        if (wallets.length == 0) {
            return 'Nenhuma saída registrada nesse dia'
        }

        // let decodedStructs = wallets.map((object) =>
        //     structDecoder.createObject('accessCampus', 'getCheckOuts', [object[0], object[1]])
        // )

        // for (let i = 0; i < decodedStructs.length; i++) {
        //     const ra = await inteliFactoryInstance.getStudent(decodedStructs[i].userAddress)
        //     decodedStructs[i] = {
        //         ra,
        //         ...decodedStructs[i],
        //     }
        //     delete decodedStructs[i].userAddress
        // }

        return wallets
    }

    async balance(ra) {
        const personInstance = await person(ra)
        const balance = await personInstance.getBalance()

        return balance
    }

    async transferMoney(from, quantity, to) {
        const personInstance = await person(from)

        const fromWallet = await this.getWallet(from)

        let toWallet = null
        if (to == 'Inteli') {
            toWallet = process.env.BLOCKCHAIN_ACCOUNT_ADDRESS
        } else {
            toWallet = await this.getWallet(to)
            walletDoesNotExistsValidation(toWallet)
        }
        
        if (quantity === '0') {
            throw new Error('Quantidade inválida para transferência')
        }

        if (toWallet === fromWallet) {
            throw new Error('Carteiras iguais, transferência inválida')
        }

        await personInstance.transferMoney(toWallet, quantity)
    }
}

module.exports = {
    Student,
}
