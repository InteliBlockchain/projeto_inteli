const { web3 } = require('../ethereum/web3')
//compiled smart contract
const { instance: inteliFactory } = require('../ethereum/factory')

class Inteli {
    async balance() {
        const balance = await inteliFactory.methods.getBalance().call({
            from: accounts[0],
        })

        return balance
    }

    async rewardStudent(quantity, raStudent) {
        const walletStudent = await inteliFactory.methods.getWallet(raStudent).call({
            from: accounts[0],
        })

        const reward = await inteliFactory.methods.rewardStudent(quantity, walletStudent).call({
            from: accounts[0],
        })
    }
}

module.exports = {
    Inteli,
}
