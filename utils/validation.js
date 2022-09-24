const walletDoesNotExistsValidation = (wallet) => {
    if (wallet === '0x0000000000000000000000000000000000000000') {
        throw new Error('Estudante não existe')
    }
}

const walletExistsValidation = (wallet, ra) => {
    // Confere se a carteira já existe
    if (wallet !== '0x0000000000000000000000000000000000000000') {
        throw new Error(`Carteira já existente para RA ${ra}`)
    }
}

const studentDoesNotExistsValidation = (ra) => {
    if (ra == "") {
        throw new Error(`Carteira não encontrada`)

    }
}

module.exports = {
    walletDoesNotExistsValidation,
    walletExistsValidation,
    studentDoesNotExistsValidation
}
