const { validationResult } = require('express-validator')
const lectureService = require('../services/Lecture')
require('express-async-errors')

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
        //Instancia a classe criando uma vaga
        const Lecture = new lectureService.Student()

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
        //Instancia a classe criando uma vaga
        const Lecture = new lectureService.Student();

        //Tratamento das respostas do método da classe
        const lectures = await Lecture.getLecturesStudent(ra);
        res.send(lectures)
    } catch (err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }
}
const getLectures = (req, res) => {
    //Instancia a classe criando uma vaga
    const Lecture = new studentService.Student()

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
