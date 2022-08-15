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
        return wallet
    }

    async createStudent(ra) {
        const accounts = await web3.eth.getAccounts()

            // confere se a carteira já existe
        if (await this.getWallet(ra) !== '0x0000000000000000000000000000000000000000') {
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

        if (walletAddress === '0x0000000000000000000000000000000000000000') {
            throw new Error('Estudante não encontrado')
        }

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

        if (wallet === '0x0000000000000000000000000000000000000000') {
            throw new Error('Estudante não encontrado')
        }

        await accessCampus.methods.registerCheckIn(wallet, time, date).send({
            from: accounts[0],
        })
        await person(wallet).methods.registerCheckIn(date, time).send({
            from: accounts[0],
        })
    }

    async checkOut(ra, time, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = this.getWallet(ra)

        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Estudante não encontrado')
        }

        await accessCampus.methods.registerCheckOut(wallet, time, date).send({
            from: accounts[0],
        })
        await person(wallet).methods.registerCheckOut(date, time).send({
            from: accounts[0],
        })
    }

    async accesses(ra, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })

        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Estudante não encontrado')
        }

        const times = await person(wallet).methods.getCheckIn(date).call({
            from: accounts[0],
        })

        return times
    }

    async exits(ra, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = this.getWallet(ra)
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
      
        for (let i = 0; i < decodedStructs.length;i++) {
            const ra = await inteliFactory.methods.getStudent(decodedStructs[i].userAddress).call({
                from: accounts[0],
            })
            decodedStructs[i] = {
                ra,
                ...decodedStructs[i]
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
      
        for (let i = 0; i < decodedStructs.length;i++) {
            const ra = await inteliFactory.methods.getStudent(decodedStructs[i].userAddress).call({
                from: accounts[0],
            })
            decodedStructs[i] = {
                ra,
                ...decodedStructs[i]
            }
            delete decodedStructs[i].userAddress
        }

        return decodedStructs
    }

    async balance(ra) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await this.getWallet(ra)
       

        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Estudante não encontrado')
        }

        const balance = await person(wallet).methods.getBalance().call({
            from: accounts[0],
        })

        return balance
    }

    async transferMoney(from, quantity, to) {
        const sender = await this.getWallet(from)

        let receiver = null
        if (to == "Inteli")  {
            receiver = await this.getWallet(contractsAdresses.addresses.at(-1).InteliFactory)
        } else {
            receiver = await this.getWallet(to)
        }

        await person(sender).methods.transferMoney(to, quantity).call({
            from: accounts[0],
        })
    }
}

module.exports = {
    Student,
}
