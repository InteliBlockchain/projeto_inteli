const { web3 } = require('../ethereum/utils/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')
const { instance: person } = require('../ethereum/contractsInteractions/person')
const { instance: accessCampus } = require('../ethereum/contractsInteractions/accessCampus')

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
        await inteliFactory.methods.createStudent(ra).send({
            from: accounts[0],
        })
    }

    async removeStudent(ra) {
        // Lembrar de executar o autodestruct do contrato person (branch do lemos)
        const walletAddress = await this.getWallet(ra)

        if (walletAddress == '0x0000000000000000000000000000000000000000') {
            throw new Error('Estudante não encontrado')
        }

        const accounts = await web3.eth.getAccounts()
        await inteliFactory.methods.removeStudent(ra).send({
            from: accounts[0],
        })
        await person(walletAddress).methods.eraseMe().send({
            from: accounts[0],
        })
    }

    async checkIn(ra, time, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })

        if (wallet == '0x0000000000000000000000000000000000000000') {
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
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })

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
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })
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
        console.log(wallets)

        //Call back funcionando
        // const accounts = await web3.eth.getAccounts()

        // let wallets = await accessCampus.methods.getCheckIns(date).call({
        //     from: accounts[0],
        // })

        // let objectsReturns = []

        // wallets.map((object) => {
        //     console.log(`Peguei esse item primeiro ${object[0]} e depois esse ${object[1]}`)
        //     objectsReturns.push(decoder.createAccessObject('accessCampus', 'getCheckIns', [object[0], object[1]]))
        // })
        // console.log(objectsReturns)

        // const ras = []
        // for (let i=0; i<wallets.length;i++) {
        //     const ra = await inteliFactory.methods.getStudent(wallets[i]).call({
        //         from: accounts[0],
        //     })
        //     ras.push(ra)
        // }
        // return ras
    }

    async allExits(date) {
        const accounts = await web3.eth.getAccounts()
        const wallets = await accessCampus.methods.getCheckOuts(date).call({
            from: accounts[0],
        })
        const ras = []
        for (let i = 0; i < wallets.length; i++) {
            const ra = await inteliFactory.methods.getStudent(wallets[i]).call({
                from: accounts[0],
            })
            ras.push(ra)
        }
        return ras
    }

    async balance(ra) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })

        if (wallet == '0x0000000000000000000000000000000000000000') {
            throw new Error('Estudante não encontrado')
        }

        const balance = await person(wallet).methods.getBalance().call({
            from: accounts[0],
        })

        return balance
    }

    async transferMoney(senderWallet, quantity, receiverWallet) {
        const sender = await inteliFactory.methods.getWallet(senderWallet).call({
            from: accounts[0],
        })

        const receiver = await inteliFactory.methods.getWallet(receiverWallet).call({
            from: accounts[0],
        })

        const transfer = await person(senderWallet).methods.transferMoney(receiverWallet, quantity).call({
            from: accounts[0],
        })
    }
}

module.exports = {
    Student,
}
