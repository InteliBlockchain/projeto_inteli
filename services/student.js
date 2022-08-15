const { web3 } = require('../ethereum/utils/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')
const { instance: person } = require('../ethereum/contractsInteractions/person')
const { instance: accessCampus } = require('../ethereum/contractsInteractions/accessCampus')

const structDecoder = require('../ethereum/utils/structDecoder')

//get deployed contracts' adresses object
const contractsAdresses = require('../ethereum/utils/contractsAddresses.json')

class Student {
    async getStudent(address) {
        const accounts = await web3.eth.getAccounts()
        const ra = await inteliFactory.methods.getStudent(address).call({ from: accounts[0] })
        return ra
    }

    async getWallet(ra) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await inteliFactory.methods.getWallet(ra).call({ from: accounts[0] })

        if (wallet === '0x0000000000000000000000000000000000000000') {
            throw new Error(`Estudante com este RA ${ra} não encontrado`)
        }
        
        return wallet
    }

    async createStudent(ra) {
        const accounts = await web3.eth.getAccounts()

        const wallet = await inteliFactory.methods.getWallet(ra).call({ from: accounts[0] })

        // confere se a carteira já existe
        if (wallet !== '0x0000000000000000000000000000000000000000') {
            throw new Error(`Carteira já existente para RA ${ra}`)
        }

        await inteliFactory.methods.createStudent(ra).send({
            from: accounts[0],
        })
    }

    async removeStudent(ra) {
        // Lembrar de executar o autodestruct do contrato person (branch do lemos)

        const accounts = await web3.eth.getAccounts()
        const walletAddress = await this.getWallet(ra)

        await inteliFactory.methods.removeStudent(ra).send({
            from: accounts[0],
        })
        await person(walletAddress).methods.eraseMe().send({
            from: accounts[0],
        })
    }

    async checkIn(ra, time, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        await accessCampus.methods.registerCheckIn(wallet, time, date).send({
            from: accounts[0],
        })
        await person(wallet).methods.registerCheckIn(date, time).send({
            from: accounts[0],
        })
    }

    async checkOut(ra, time, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        await accessCampus.methods.registerCheckOut(wallet, time, date).send({
            from: accounts[0],
        })
        await person(wallet).methods.registerCheckOut(date, time).send({
            from: accounts[0],
        })
    }

    async accesses(ra, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        const times = await person(wallet).methods.getCheckIn(date).call({
            from: accounts[0],
        })

        return times
    }

    async exits(ra, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        const times = await person(wallet).methods.getCheckOut(date).call({
            from: accounts[0],
        })
        return times
    }

    async allAccesses(date) {
        const accounts = await web3.eth.getAccounts()
        const wallets = await accessCampus.methods.getCheckIns(date).call({
            from: accounts[0],
        })

        if (wallets.length == 0) {
            return 'Nenhuma entrada registrada nesse dia'
        }

        let decodedStructs = wallets.map((object) =>
            structDecoder.createObject('accessCampus', 'getCheckIns', [object[0], object[1]])
        )

        for (let i = 0; i < decodedStructs.length; i++) {
            const ra = await inteliFactory.methods.getStudent(decodedStructs[i].userAddress).call({
                from: accounts[0],
            })
            decodedStructs[i] = {
                ra,
                ...decodedStructs[i],
            }
            delete decodedStructs[i].userAddress
        }

        return decodedStructs
    }

    async allExits(date) {
        const accounts = await web3.eth.getAccounts()
        const wallets = await accessCampus.methods.getCheckOuts(date).call({
            from: accounts[0],
        })

        if (wallets.length == 0) {
            return 'Nenhuma saída registrada nesse dia'
        }

        let decodedStructs = wallets.map((object) =>
            structDecoder.createObject('accessCampus', 'getCheckOuts', [object[0], object[1]])
        )

        for (let i = 0; i < decodedStructs.length; i++) {
            const ra = await inteliFactory.methods.getStudent(decodedStructs[i].userAddress).call({
                from: accounts[0],
            })
            decodedStructs[i] = {
                ra,
                ...decodedStructs[i],
            }
            delete decodedStructs[i].userAddress
        }

        return decodedStructs
    }

    async balance(ra) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)

        const balance = await person(wallet).methods.getBalance().call({
            from: accounts[0],
        })

        return balance
    }

    async transferMoney(from, quantity, to) {
        const accounts = await web3.eth.getAccounts()
        const fromWallet = await this.getWallet(from)
        
        let toWallet = null
        if (to == 'Inteli') {
            toWallet = contractsAdresses.addresses.at(-1).InteliFactory
        } else {
            toWallet = await this.getWallet(to)
        }

        if (quantity === "0") {
            throw new Error("Quantidade inválida para transferência")

        }

        if (toWallet === fromWallet) {
            throw new Error("Carteiras iguais, transferência inválida")
        }
        
        await person(fromWallet).methods.transferMoney(toWallet, quantity).send({
            from: accounts[0],
        })
    }
}

module.exports = {
    Student,
}
