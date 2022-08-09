const { web3 } = require('../ethereum/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/factory')

class Student {
    async getStudent(address) {
        try {
            const accounts = await web3.eth.getAccounts()
            const ra = await inteliFactory.methods.getStudent(address).call({ from: accounts[0] })
            const success = {
                type: "success",
                message: ra
            }
            return success
        } catch (err) {
            const error = {
                type: "error",
                message: "Solicitação não autorizada! Tente novamente mais tarde"
            }
            return error
        }
    }

    async getWallet(ra) {
        try {
            const accounts = await web3.eth.getAccounts()
            const wallet = await inteliFactory.methods.getWallet(ra).call({ from: accounts[0] })
            const success = {
                type: "success",
                message: wallet
            }
            return success
        } catch (err) {
            const error = {
                type: "error",
                message: "Solicitação não autorizada! Tente novamente mais tarde"
            }
            return error
        }
    }

    async createStudent(ra) {
        try {
            const accounts = await web3.eth.getAccounts()

            await inteliFactory.methods.createStudent(ra).send({
                from: accounts[0],
            })

            const success = {
                type: "success",
                message: "Aluno criado com sucesso"
            }
            return success
        } catch (err) {
            const error = {
                type: "error",
                message: "Solicitação não autorizada! Tente novamente mais tarde"
            }
            return error
        }
    }

    async removeStudent(ra) {
        try {
            const accounts = await web3.eth.getAccounts()

            await inteliFactory.methods.removeStudent(ra).send({
                from: accounts[0],
            })

            const success = {
                type: "success",
                message: "Aluno removido com sucesso"
            }
            return success
        } catch (err) {
            const error = {
                type: "error",
                message: "Solicitação não autorizada! Tente novamente mais tarde"
            }
            return error
        }
        // Lembrar de executar o autodestruct do contrato person (branch do lemos)
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

    async accesses(ra) {}

    async exits(ra) {}

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
}

module.exports = {
    Student
}