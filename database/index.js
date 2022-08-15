//database setup
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const connectToDatabase = async () => {
    // CONECTAR AO BANCO DE DADOS
    const dbInstance = await open({
        filename: './database/database.db',
        driver: sqlite3.Database,
    })
    return dbInstance
}

module.exports = {
    connectToDatabase,
}
