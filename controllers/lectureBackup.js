const { validationResult } = require('express-validator')
const lectureService = require('../services/lecture')
require('express-async-errors')

const Lecture = new lectureService.Lecture()

const createLecture = async (req, res) => {
    //Pega as infos da requisição
    const { name, ras, description } = req.body
    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
       
    }

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
    try {
        //Tratamento das respostas do método da classe
        const lectures = await Lecture.getLectures()
        res.send(lectures)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    createLecture,
    getLecturesStudent,
    getLectures,
}
