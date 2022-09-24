const { ethers } = require('ethers')

const { inteliFactory } = require('../utils/ethers')
const { walletDoesNotExistsValidation } = require('../utils/validation')
const { blockchainConnection } = require('../utils/ethers')

class Inteli {
    async balance() {
        const { provider } = await blockchainConnection()
        const balance = await provider.getBalance(process.env.BLOCKCHAIN_ACCOUNT_ADDRESS)
        const formatedBalance = ethers.utils.formatEther(balance)
        return formatedBalance
    }

    async rewardStudent(quantity, raStudent) {
        const { signer } = await blockchainConnection()

        const inteliFactoryInstance = await inteliFactory()

        const wallet = inteliFactoryInstance.getWallet(raStudent)
        walletDoesNotExistsValidation(wallet)

        await signer.sendTransaction({
            to: wallet,
            value: ethers.utils.parseEther(quantity),
        })
    }
}

module.exports = {
    Inteli,
}
