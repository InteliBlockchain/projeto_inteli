const jwt = require('jsonwebtoken')

const encryptLecture = (name) => {
    // Criptografar a informação
    const hashedName = jwt.sign({ name }, process.env.JWT_ENCRYPT_KEY)
    return { hashedName }
}

const desencryptLecture = (encryptedLecture) => {
    const decoded = jwt.verify(encryptedLecture, process.env.JWT_ENCRYPT_KEY)
    return {name: decoded.name}
}

module.exports = {
    encryptLecture,
    desencryptLecture,
}
