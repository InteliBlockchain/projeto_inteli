const { validationResult } = require('express-validator')
const AccessCampusERC20Service = require('../services/AccessCampusERC20.js')
require('express-async-errors')

const AccessCampusERC20 = new AccessCampusERC20Service.AccessCampusERC20()

const givePresence = async (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg,
        })
        return
    }
    try {
        //Tratamento das respostas do método da classe
        await AccessCampusERC20.givePresence(ra)

        res.send('Presença dada com sucesso')
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const removePresence = async (req, res) => {
    //Pega as infos da requisição
    const { ra, qnt } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg,
        })
        return
    }
    try {
        //Tratamento das respostas do método da classe
        await AccessCampusERC20.removePresence(ra, qnt)

        res.send('Presença removida com sucesso')
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const seePresences = async (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg,
        })
        return
    }
    try {
        //Tratamento das respostas do método da classe
        const presenças = await AccessCampusERC20.seePresences(ra)

        res.send(presenças)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    givePresence,
    removePresence,
    seePresences
}
