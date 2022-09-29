const { ethers } = require('ethers')
// Import contract's intances
const { accessCampus, inteliFactory } = require('../utils/ethers')
// Import new validations
const { walletDoesNotExistsValidation } = require('../utils/validation')

class AccessCampusERC20 {
    async createPresenceTokens(qnt) {
        const accessCampusInstance = await accessCampus()

        await accessCampusInstance.createToken(qnt)
    }

    async totalSupply() {
        const accessCampusInstance = await accessCampus()

        let totalSupply = await accessCampusInstance.totalSupply()

        totalSupply = ethers.BigNumber.from(totalSupply).toNumber()

        return totalSupply
    }

    async givePresence(ra) {
        const accessCampusInstance = await accessCampus()
        const inteliFactoryInstance = await inteliFactory()

        const studentWallet = await inteliFactoryInstance.getWallet(ra)
        walletDoesNotExistsValidation(studentWallet)

        await accessCampusInstance.givePresence(studentWallet)
    }

    async removePresence(ra, qnt) {
        const accessCampusInstance = await accessCampus()
        const inteliFactoryInstance = await inteliFactory()

        const studentWallet = await inteliFactoryInstance.getWallet(ra)
        walletDoesNotExistsValidation(studentWallet)

        await accessCampusInstance.removePresence(studentWallet, qnt)
    }

    async seePresences(ra) {
        const accessCampusInstance = await accessCampus()
        const inteliFactoryInstance = await inteliFactory()

        const studentWallet = await inteliFactoryInstance.getWallet(ra)
        walletDoesNotExistsValidation(studentWallet)

        let amount = await accessCampusInstance.seePresences(studentWallet)

        amount = ethers.BigNumber.from(amount).toNumber()

        return amount
    }
}

module.exports = {
    AccessCampusERC20,
}
