const { validationResult } = require('express-validator')
const lectureService = require('../services/lecture')
require('express-async-errors')

const Lecture = new lectureService.Lecture()

const createLecture = async (req, res) => {
    //Pega as infos da requisição
    const { name, ras, description } = req.body
   

    try {
        //Tratamento das respostas do método da classe
        await Lecture.createLecture(req.file, name, ras, description);
        res.send("Palestra criada e usuários cadastrados")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getLecturesStudent = async (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.params
    try {
        //Tratamento das respostas do método da classe
        const lectures = await Lecture.getLecturesStudent(ra);
        res.send(lectures)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getLectures = async (req, res) => {
    //Pega as infos da requisição
    const { name, ras, description } = req.body

    try {
        //Tratamento das respostas do método da classe
        await Lecture.createLecture(req.file, name, ras, description);
        res.send("Palestra criada e usuários cadastrados")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const burnNFT = async (req, res) => {
    //Pega as infos da requisição
    const { nft } = req.body
    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
       
    }

    try {
        //Tratamento das respostas do método da classe
        await Lecture.burnNFT(nft);
        res.send("NFT queimada com sucesso")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getLectureRas = async (req, res) => {
    //Pega as infos da requisição
    const { lecture } = req.params

    try {
        //Tratamento das respostas do método da classe
        const ras = await Lecture.getLectureRas(lecture);
        res.send(ras)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const changeURI = async (req, res) => {
    //Pega as infos da requisição
    const { nsei /*Coloca aqui pq eu nn sei oq vem */ } = req.body
    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    try {
        //Tratamento das respostas do método da classe
        await Lecture.changeURI(nsei);
        res.send("URI atualizada com sucesso")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    createLecture,
    getLecturesStudent,
    getLectures,
    burnNFT,
    getLectureRas,
    changeURI
}
