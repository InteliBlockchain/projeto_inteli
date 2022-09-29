// Import contract's intances
const { accessCampus, inteliFactory } = require('../utils/ethers')

// Import new validations
const { walletDoesNotExistsValidation } = require('../utils/validation')

class AccessCampusERC20 {
    async createPresenceTokens(qnt) {
        const accessCampusInstance = await accessCampus()

        await accessCampusInstance.createToken(qnt)
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

        const amount = await accessCampusInstance.seePresences(studentWallet)

        return amount
    }
}

module.exports = {
    AccessCampusERC20,
}
