const { web3 } = require('../ethereum/utils/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')

class Inteli {
    async balance() {
        const accounts = await web3.eth.getAccounts()
        const balance = await inteliFactory.methods.getBalance().call({
            from: accounts[0],
        })

        return balance
    }

    async rewardStudent(quantity, raStudent) {
        const accounts = await web3.eth.getAccounts()
        const walletStudent = await inteliFactory.methods.getWallet(raStudent).call({
            from: accounts[0],
        })

        if (walletStudent == '0x0000000000000000000000000000000000000000') {
            throw new Error('Student does not exist')
        }

        await inteliFactory.methods.transferMoney(walletStudent, quantity).send({
            from: accounts[0],
        })
    }
}

module.exports = {
    Inteli,
}
