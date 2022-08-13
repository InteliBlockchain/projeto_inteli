const { validationResult } = require('express-validator')
const lectureService = require('../services/lecture')
require('express-async-errors')

const Lecture = new lectureService.Student()

const createLecture = async (req, res) => {
    //Pega as infos da requisição
    const { lectureName, ras } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg,
        })
        return
    } else {
        try {
            //Tratamento das respostas do método da classe
            await Lecture.createLecture(lectureName, ras);
            res.send("Palestra criada e usuários cadastrados")
        } catch (err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}
const getLecturesStudent = async (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.param
    try {
        //Tratamento das respostas do método da classe
        const lectures = await Lecture.getLecturesStudent(ra);
        res.send(lectures)
    } catch (err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }
}
const getLectures = (req, res) => {
    try {
        //Tratamento das respostas do método da classe
        const lectures = await Lecture.getLectures()
        res.send(lectures)
    } catch (err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    createLecture,
    getLecturesStudent,
    getLectures,
}
