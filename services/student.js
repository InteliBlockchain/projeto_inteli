// Compiled smart contracts
const { ethers, utils } = require('ethers')

const structDecoder = require('../utils/structDecoder')

//Import the new instances
const { inteliFactory, accessCampus, person, blockchainConnection } = require('../utils/ethers')

// Import new validations
const { walletDoesNotExistsValidation, studentDoesNotExistsValidation } = require('../utils/validation')
const { walletExistsValidation } = require('../utils/validation')

class Student {
    // Get students from the wallet adress and return RA from the account
    async getStudent(address) {
        // Contract instance
        const instance = await inteliFactory()
        // Get the student from his wallet adress
        const student = await instance.getStudent(address)

        // Validates if the student exists
        studentDoesNotExistsValidation(student)
        return student
    }

    // Get the wallet adress from RA
    async getWallet(ra) {
        // Contract instance
        const instance = await inteliFactory()
        // Get the wallet from RA
        const wallet = await instance.getWallet(ra)

        // Validates if the wallet exists
        walletDoesNotExistsValidation(wallet)
        return wallet
    }

    // Create a student from the RA
    async createStudent(ra) {
        // Contract instance
        const instance = await inteliFactory()
        // Get the wallet from RA
        const wallet = await instance.getWallet(ra)

        // Validates if the wallet exists
        walletExistsValidation(wallet, ra)

        await instance.createStudent(ra)
    }

    // Remove a student from RA and erase his wallet
    async removeStudent(ra) {
        // Contract instance
        const inteliFactoryInstance = await inteliFactory()
        // Contract instance
        const personInstance = await person(ra)
        // Erase the student
        await personInstance.eraseMe()

        // Remove the student
        await inteliFactoryInstance.removeStudent(ra)

    }

    // Register check in of a student in a specific date and time
    async checkIn(ra, time, date) {
        // Contract instance
        const personInstance = await person(ra)
        // Register the check in from date and time
        await personInstance.registerCheckIn(date, time)

        // Get the wallet from ra
        const wallet = this.getWallet(ra)
        // Contract instance
        const accessCampusInstance = await accessCampus()
        await accessCampusInstance.registerCheckIn(wallet, time, date)
    }

    // Register check out of a student in a specific date and time
    async checkOut(ra, time, date) {
        // Contract instance
        const personInstance = await person(ra)
        // Register the check in from date and time
        await personInstance.registerCheckOut(date, time)

        // Get the wallet from ra
        const wallet = this.getWallet(ra)
        // Contract instance
        const accessCampusInstance = await accessCampus()
        await accessCampusInstance.registerCheckOut(wallet, time, date)
    }

    // Get all the check ins of a student returning all the check in times
    async accesses(ra, date) {
        // Contract instance
        const personInstance = await person(ra)
        // Get the check ins from the date
        const accesses = await personInstance.getCheckIn(date)
        // Format all the acesses to a number
        const formatedAccesses = accesses.map((bigNumber) => ethers.BigNumber.from(bigNumber).toNumber())

        return formatedAccesses
    }

    // Get all the check outs of a student returning all the check out times
    async exits(ra, date) {
        // Contract instance
        const personInstance = await person(ra)
        // Get the check outs from the date
        const exits = await personInstance.getCheckOut(date)
        // Format all the acesses to a number
        const formatedExits = exits.map((bigNumber) => ethers.BigNumber.from(bigNumber).toNumber())

        return formatedExits
    }

    // Get all the check ins in a specific date returning all the adresses in that date
    async allAccesses(date) {
        // Contract instances
        const accessCampusInstance = await accessCampus()
        const inteliFactoryInstance = await inteliFactory()

        const wallets = await accessCampusInstance.getCheckIns(date)

        // Check if there isn't check ins in the specific date
        if (wallets.length == 0) {
            return 'Nenhuma entrada registrada nesse dia'
        }

        // Map the wallets that checked in in the specific date
        let decodedStructs = wallets.map((object) =>
            structDecoder.createObject('accessCampus', 'getCheckIns', [object[0], object[1]])
        )

        // Loop that count "i" until it is less than the object created
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

    // Get all the check outs in a specific date returning all the adresses in that date
    async allExits(date) {
        // Contract instances
        const accessCampusInstance = await accessCampus()
        const inteliFactoryInstance = await inteliFactory()

        const wallets = await accessCampusInstance.getCheckOuts(date)

        // Check if there isn't check ins in the specific date
        if (wallets.length == 0) {
            return 'Nenhuma sa??da registrada nesse dia'
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

    // Get the balance of a specific wallet
    async balance(ra) {
        // Contract instance
        const instance = await inteliFactory()
        // Get the wallet from RA
        const wallet = await instance.getWallet(ra)

        // Validates if the wallet exists
        walletDoesNotExistsValidation(wallet)

        // Connect provider to blockchain
        const { provider } = await blockchainConnection()

        // Get the balance from the wallet
        const bigNumberBalance = await provider.getBalance(wallet)

        // Format the balance to a string
        // const formatedBalance = ethers.BigNumber.from(bigNumberBalance.toString())
        return ethers.utils.formatEther(bigNumberBalance)
    }

    // Transfer a quantity of money from a wallet to another
    async transferMoney(from, quantity, to) {
        // Get the sender student wallet
        const personInstance = await person(from)
        const fromWallet = await this.getWallet(from)

        

        let toWallet = null
        // Get the receiver student wallet
        if (to == 'Inteli') {
            toWallet = process.env.BLOCKCHAIN_ACCOUNT_ADDRESS
        } else {
            toWallet = await this.getWallet(to)
            walletDoesNotExistsValidation(toWallet)
        }

        // Check if the quantity is null and throw an error
        if (quantity === '0') {
            throw new Error('Quantidade inv??lida para transfer??ncia')
        }

        // Check if the receiver wallet is the same as the sender one and throw an error
        if (toWallet === fromWallet) {
            throw new Error('Carteiras iguais, transfer??ncia inv??lida')
        }

        if (await this.balance(from) < quantity) {
            throw new Error("Quantidade na carteira insuficiente!")
        }

        // const quantityInEthers = quantity * (10**18)
        // console.log("quantityInEthers" ,quantityInEthers)

        console.log(quantity.toString())
        console.log(utils.parseEther("5.0"))


        // Transfer the money
        await personInstance.transferMoney(toWallet, { value: utils.parseEther(quantity.toString()) })


    }
}

module.exports = {
    Student,
}
