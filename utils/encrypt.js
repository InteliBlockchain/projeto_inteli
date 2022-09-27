const jwt = require('jsonwebtoken')

const encryptLecture = (name) => {
    // Criptografar a informação
    const hashedName = jwt.sign({ name }, process.env.JWT_ENCRYPT_KEY)
    return { hashedName }
}

module.exports = {
    encryptLecture,
}
