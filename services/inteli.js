<<<<<<< Updated upstream
const { ethers } = require('ethers')

const { inteliFactory } = require('../utils/ethers')
const { walletDoesNotExistsValidation } = require('../utils/validation')
const { blockchainConnection } = require('../utils/ethers')

=======
const { web3 } = require('../ethereum/utils/web3')
// Compiled smart contract
const { instance: inteliFactory } = require('../ethereum/contractsInteractions/inteliFactory')
>>>>>>> Stashed changes

class Inteli {
    // Check the wallet balance 
    async balance() {
        const { provider } = blockchainConnection()
        const balance = await provider.getBalance(process.env.BLOCKCHAIN_ACCOUNT_ADDRESS)
        const formatedBalance = ethers.utils.formatEther(balance)
        return formatedBalance
    }
    // Check if the student exists and transfer the amount to his wallet
    async rewardStudent(quantity, raStudent) {
        const {  signer } = blockchainConnection()

        const inteliFactoryInstance = await inteliFactory()

        const wallet = inteliFactoryInstance.getWallet(raStudent)
        walletDoesNotExistsValidation(wallet)

        await signer.sendTransaction({
            to: wallet,
            value: ethers.utils.parseEther(quantity)
        }); 
    }
}

module.exports = {
    Inteli,
}
