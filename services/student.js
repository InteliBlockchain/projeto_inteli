const { web3 } = require('../ethereum/utils/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')
const { instance: person} = require('../ethereum/contractInteractions/person')

class Student {
    async getStudent(address) {
        // try {
        //     const accounts = await web3.eth.getAccounts()
        //     const ra = await inteliFactory.methods.getStudent(address).call({ from: accounts[0] })
        //     const success = {
        //         type: 'success',
        //         message: ra,
        //     }
        //     return success
        // } catch (err) {
        //     const error = {
        //         type: 'error',
        //         message: 'Solicitação não autorizada! Tente novamente mais tarde',
        //     }
        //     return error
        // }
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
        // try {
        //     const accounts = await web3.eth.getAccounts()

        //     await inteliFactory.methods.removeStudent(ra).send({
        //         from: accounts[0],
        //     })

        //     const success = {
        //         type: 'success',
        //         message: 'Aluno removido com sucesso',
        //     }
        //     return success
        // } catch (err) {
        //     const error = {
        //         type: 'error',
        //         message: 'Solicitação não autorizada! Tente novamente mais tarde',
        //     }
        //     return error
        // }
        // Lembrar de executar o autodestruct do contrato person (branch do lemos)
        const accounts = await web3.eth.getAccounts()
        await inteliFactory.methods.removeStudent(ra).send({
            from: accounts[0],
        })
    }

    async checkIn(ra, time, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })
        await accessCampus.methods.registerCheckIn(wallet, time, date).send({
            from: accounts[0],
        })
        await person.methods.registerCheckIn(date, time).send({
            from: accounts[0],
        })
    }

    async checkOut(ra, time, date) {
        const accounts = await web3.eth.getAccounts()
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })
        await accessCampus.methods.registerCheckOut(wallet, time, date).send({
            from: accounts[0],
        })
        await person.methods.registerCheckOut(date, time).send({
            from: accounts[0],
        })
    }

    async accesses(ra, date) {
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })
        const times = await person.methods.getCheckIn(wallet, date).call({
            from: accounts[0],
        })
        return times
    }

    async exits(ra, date) {
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })
        const times = await person.methods.getCheckOut(wallet, date).call({
            from: accounts[0],
        })
        return times
    }

    async AllAccesses() {
        const wallets = await accessCampus.methods.getStudentEntries().call({
            from: accounts[0],
        })
        const ras = []
        for (wallet of wallets) {
            const ra = await inteliFactory.methods.getStudent(wallet).call({
                from: accounts[0],
            })
            ras.push(ra)
        }
        return ras
    }

    async AllExits() {
        const wallets = await accessCampus.methods.getStudentExits().call({
            from: accounts[0],
        })
        const ras = []
        for (wallet of wallets) {
            const ra = await inteliFactory.methods.getStudent(wallet).call({
                from: accounts[0],
            })
            ras.push(ra)
        }
        return ras
    }

    async balance(ra) {
        const wallet = await inteliFactory.methods.getWallet(ra).call({
            from: accounts[0],
        })
        const balance = await person(wallet).methods.getBalance().call({
            from: accounts[0],
        })
    
        return balance
    }

    async transferMoney(raOrigem, quantity, raDestino) {
        const walletOrigem = await inteliFactory.methods.getWallet(raOrigem).call({
            from: accounts[0],
        })

        const walletDestino = await inteliFactory.methods.getWallet(raDestino).call({
            from: accounts[0],
        })

        const transfer = await person(walletOrigem).methods.transferMoney(walletDestino, quantity).call({
            from: accounts[0],
        })
    }
}

module.exports = {
    Student,
}
