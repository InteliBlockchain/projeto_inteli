const { ethers } = require('ethers')
// Compiled smart contract
const { inteliFactory } = require('../utils/ethers')
const { walletDoesNotExistsValidation } = require('../utils/validation')
const { blockchainConnection } = require('../utils/ethers')

class Inteli {
    // Check the wallet balance
    async balance() {
        // Connect provider to blockchain
        const { provider } = await blockchainConnection()

        // Get the balance from the account address
        const balance = await provider.getBalance(process.env.BLOCKCHAIN_ACCOUNT_ADDRESS)

        // Format the balance from the balance gotten using ethers  
        const formatedBalance = ethers.utils.formatEther(balance)
        return formatedBalance
    }

    // Check if the wallet exists and transfer the amount to his wallet
    async rewardStudent(quantity, raStudent) {
        // Connect signer to blockchain
        const { signer } = await blockchainConnection()

        // Contract instance
        const inteliFactoryInstance = await inteliFactory()

        // Get the wallet from RA
        const wallet = await inteliFactoryInstance.getWallet(raStudent)
        walletDoesNotExistsValidation(wallet)
       
        // Execute the trasaction
        await signer.sendTransaction({
            to: wallet,
            value: ethers.utils.parseEther(quantity),
            gasLimit: 50000,
        })
    }
}

module.exports = {
    Inteli,
}
