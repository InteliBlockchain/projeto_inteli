<<<<<<< Updated upstream
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
=======
const { web3 } = require('../ethereum/utils/web3')
// Compiled smart contract
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')
const { instance: person } = require('../ethereum/contractsInteractions/person')
const { instance: accessCampus } = require('../ethereum/contractsInteractions/accessCampus')

const structDecoder = require('../ethereum/utils/structDecoder')

// Get deployed contracts adresses object
const contractsAdresses = require('../ethereum/utils/contractsAddresses.json')
>>>>>>> Stashed changes

class Student {
    // Get students from the wallet adress and return RA from the account
    async getStudent(address) {
        const instance = await inteliFactory()
        const student = await instance.getStudent(address)
        studentDoesNotExistsValidation(student)
        return student
    }

    // Get the wallet adress from RA
    async getWallet(ra) {
<<<<<<< Updated upstream
        const instance = await inteliFactory()
        const wallet = await instance.getWallet(ra)
        walletDoesNotExistsValidation(wallet)
=======
        const accounts = await web3.eth.getAccounts()
        const wallet = await inteliFactory.methods.getWallet(ra).call({ from: accounts[0] })
        
        // Check if the wallet gotten from RA exists
        if (wallet === '0x0000000000000000000000000000000000000000') {
            throw new Error(`Estudante com este RA ${ra} não encontrado`)
        }
        
>>>>>>> Stashed changes
        return wallet
    }

    // Create a student from the RA
    async createStudent(ra) {
<<<<<<< Updated upstream
        const instance = await inteliFactory()
        const wallet = await instance.getWallet(ra)
        walletExistsValidation(wallet, ra)
        await instance.createStudent(ra)
=======
        const accounts = await web3.eth.getAccounts()

        const wallet = await inteliFactory.methods.getWallet(ra).call({ from: accounts[0] })

        // Check if the wallet exists
        if (wallet !== '0x0000000000000000000000000000000000000000') {
            throw new Error(`Carteira já existente para RA ${ra}`)
        }

        // Create the student
        await inteliFactory.methods.createStudent(ra).send({
            from: accounts[0],
        })
>>>>>>> Stashed changes
    }

    // Remove a student from RA and erase his wallet
    async removeStudent(ra) {
<<<<<<< Updated upstream
        const inteliFactoryInstance = await inteliFactory()
        await inteliFactoryInstance.removeStudent(ra)

        const personInstance = await person(ra)
        await personInstance.eraseMe()
=======
        // Lembrar de executar o autodestruct do contrato person (branch do lemos)
        // Get the student wallet from RA
        const accounts = await web3.eth.getAccounts()
        const walletAddress = await this.getWallet(ra)

        // Remove the student
        await inteliFactory.methods.removeStudent(ra).send({
            from: accounts[0],
        })
        await person(walletAddress).methods.eraseMe().send({
            from: accounts[0],
        })
>>>>>>> Stashed changes
    }

    // Register check in of a student in a specific date and time
    async checkIn(ra, time, date) {
<<<<<<< Updated upstream
        const personInstance = await person(ra)
        await personInstance.registerCheckIn(date, time)

        const wallet = this.getWallet(ra)
        const accessCampusInstance = await accessCampus()
        await accessCampusInstance.registerCheckIn(wallet, time, date)

=======
        // Get the student wallet from RA
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        // Register the check in
        await accessCampus.methods.registerCheckIn(wallet, time, date).send({
            from: accounts[0],
        })
        await person(wallet).methods.registerCheckIn(date, time).send({
            from: accounts[0],
        })
>>>>>>> Stashed changes
    }

    // Register check out of a student in a specific date and time
    async checkOut(ra, time, date) {
<<<<<<< Updated upstream
        const personInstance = await person(ra)
        await personInstance.registerCheckOut(date, time)

        
        const wallet = this.getWallet(ra)
        const accessCampusInstance = await accessCampus()
        await accessCampusInstance.registerCheckOut(wallet, time, date)
        
=======
        // Get the student wallet from RA
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        // Register the check out
        await accessCampus.methods.registerCheckOut(wallet, time, date).send({
            from: accounts[0],
        })
        await person(wallet).methods.registerCheckOut(date, time).send({
            from: accounts[0],
        })
>>>>>>> Stashed changes
    }

    // Get all the check ins of a student returning all the check in times
    async accesses(ra, date) {
<<<<<<< Updated upstream
        const personInstance = await person(ra)
        const accesses = await personInstance.getCheckIn(date)
        const formatedAccesses = accesses.map(bigNumber => ethers.BigNumber.from(bigNumber).toNumber())
        return formatedAccesses
=======
        // Get the student wallet from RA
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        // Get all the check ins of the student
        const times = await person(wallet).methods.getCheckIn(date).call({
            from: accounts[0],
        })

        return times
>>>>>>> Stashed changes
    }

    // Get all the check outs of a student returning all the check out times
    async exits(ra, date) {
<<<<<<< Updated upstream
        const personInstance = await person(ra)
        const exits = await personInstance.getCheckOut(date)
        const formatedExits = exits.map(bigNumber => ethers.BigNumber.from(bigNumber).toNumber())

        return formatedExits
    }
    
=======
        // Get the student wallet from RA
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        // Get all the check outs of the student
        const times = await person(wallet).methods.getCheckOut(date).call({
            from: accounts[0],
        })
        return times
    }

    // Get all the check ins in a specific date returning all the adresses in that date
>>>>>>> Stashed changes
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

    // Get all the check outs in a specific date returning all the adresses in that date
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

    // Get the balance of a specific wallet
    async balance(ra) {
<<<<<<< Updated upstream
        const personInstance = await person(ra)
        const balance = await personInstance.getBalance()
=======
        // Get the student wallet from RA
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        // Get the balance
        const balance = await person(wallet).methods.getBalance().call({
            from: accounts[0],
        })
>>>>>>> Stashed changes

        return balance
    }

    // Transfer a quantity of money from a wallet to another
    async transferMoney(from, quantity, to) {
<<<<<<< Updated upstream
        const personInstance = await person(from)

=======
        // Get the sender student wallet
        const accounts = await web3.eth.getAccounts()
>>>>>>> Stashed changes
        const fromWallet = await this.getWallet(from)

        let toWallet = null
        // Get the receiver student wallet
        if (to == 'Inteli') {
            toWallet = process.env.BLOCKCHAIN_ACCOUNT_ADDRESS
        } else {
            toWallet = await this.getWallet(to)
            walletDoesNotExistsValidation(toWallet)
        }
<<<<<<< Updated upstream
        
        if (quantity === '0') {
            throw new Error('Quantidade inválida para transferência')
=======

        // Check if the quantity is null and throw an error
        if (quantity === "0") {
            throw new Error("Quantidade inválida para transferência")

>>>>>>> Stashed changes
        }

        // Check if the receiver wallet is the same as the sender one and throw an error
        if (toWallet === fromWallet) {
            throw new Error('Carteiras iguais, transferência inválida')
        }
<<<<<<< Updated upstream

        await personInstance.transferMoney(toWallet, quantity)
=======
        
        // Transfer the money
        await person(fromWallet).methods.transferMoney(toWallet, quantity).send({
            from: accounts[0],
        })
>>>>>>> Stashed changes
    }
}

module.exports = {
    Student,
}
