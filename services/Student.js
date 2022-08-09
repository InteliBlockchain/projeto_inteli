const { web3 } = require('../ethereum/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/factory')

class Student {
    async getStudent(req, res) {
        try {
            const accounts = await web3.eth.getAccounts()
            const ra = await inteliFactory.methods.getStudent(req.body.address).call({ from: accounts[0] })
            res.send(ra)
        } catch (err) {
            res.status(400).send()
        }
    }

    async getWallet(req, res) {
        try {
            const accounts = await web3.eth.getAccounts()
            const wallet = await inteliFactory.methods.getWallet(req.body.ra).call({ from: accounts[0] })
            res.send(wallet)
        } catch (err) {
            res.status(400).send()
        }
    }

    async createStudent(req, res) {
        try {
            const accounts = await web3.eth.getAccounts()

            await inteliFactory.methods.createStudent(req.body.ra).send({
                from: accounts[0],
            })
        } catch (err) {
            res.status(400).send()
        }
    }

    async removeStudent(req, res) {
        try {
            const accounts = await web3.eth.getAccounts()

            await inteliFactory.methods.removeStudent(req.body.ra).send({
                from: accounts[0],
            })

            res.send()
        } catch (err) {
            res.status(400).send()
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

    async accesses(ra,date) {
        const wallet = await inteliFactory.methods.getWallet(ra).call({
          from: accounts[0],
      })
        const times = await person.methods.getCheckIn(wallet,date).call({
          from: accounts[0],
        })  
        return times
      }
  
      async exits(ra,date) {
        const wallet = await inteliFactory.methods.getWallet(ra).call({
          from: accounts[0],
      })
       const times =  await person.methods.getCheckOut(wallet,date).call({
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
}

const StudentInstance = new Student()

module.exports = {
    StudentInstance,
}
