const { validationResult } = require('express-validator')
const studentService = require('../services/student')

const Student = new studentService.Student()

const formatDate = (date) => {
    let d = new Date(date)
    let month = (d.getMonth() + 1).toString()
    let day = d.getDate().toString()
    let year = d.getFullYear()
    if (month.length < 2) {
        month = '0' + month
    }
    if (day.length < 2) {
        day = '0' + day
    }
    return [year, month, day].join('-')
}

const getStudent = async (req, res) => {
    //Pega as infos da requisição
    const { wallet } = req.body

    try {
        //Tratamento das respostas do método da classe
        const ra = await Student.getStudent(wallet)
        res.send(ra)
    } catch (err) {
        res.status(500).send()
    }
}

const createStudent = async (req, res) => {
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
        await Student.createStudent(ra)

        res.send('Usuário criado com sucesso')
    } catch (err) {
        res.status(400).send('Erro ao criar carteira para o estudante')
    }
}

const getWallet = async (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.body

    try {
        //Tratamento das respostas do método da classe
        const wallet = await Student.getWallet(ra)
        res.send(wallet)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
}

const deleteStudent = async (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.params

    //Tratamento das respostas do método da classe
    try {
        //Tratamento das respostas do método da classe
        await Student.removeStudent(ra)
        res.send('Usuário removido com sucesso')
    } catch (err) {
        res.status(500).send('Erro ao remover usuário')
    }

    return Student
}

const checkIn = async (req, res) => {
    //Pega as infos da requisição
    const { ra, dateTime } = req.body

    const formatedDate = new Date(dateTime)

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg,
        })
        return
    }

    try {
        await Student.checkIn(ra, formatedDate.getTime(), formatDate(dateTime))
        res.send('Registro de entrada feito com sucesso')
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

const checkOut = async (req, res) => {
    //Pega as infos da requisição
    const { ra, dateTime } = req.body

    const formatedDate = new Date(dateTime)

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
        await Student.checkOut(ra, formatedDate.getTime(), formatDate(dateTime))
        res.send('Registro de saída feito com sucesso')
    } catch (err) {
        res.status(500).send()
    }
}

const accesses = async (req, res) => {
    //Pega as infos da requisição
    const { ra, date } = req.body

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
        const times = await Student.accesses(ra, date)

        res.send(times)
    } catch (err) {
        res.status(500).send('Erro ao buscar as entradas')
    }

    return Student
}

const exits = async (req, res) => {
    //Pega as infos da requisição
    const { ra, date } = req.body

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
        const times = await Student.accesses(ra, date)
        res.send(times)
    } catch (err) {
        res.status(500).send()
    }
}

const allAccesses = async (req, res) => {
    //Pega as infos da requisição
    const { date } = req.params

    try {
        const ras = await Student.allAccesses(date)
        res.send(ras)
    } catch (err) {
        res.status(500).send()
    }
}

const allExits = async (req, res) => {
    //Pega as infos da requisição
    const { date } = req.query

    try {
        const ras = await Student.allExits(date)
        res.send(ras)
    } catch (err) {
        res.status(500).send()
    }
}

const balance = async (req, res) => {
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
        const balance = await Student.balance(ra)
        res.send(balance)
    } catch (err) {

        res.status(500).send()
    }
}

const transferMoney = async (req, res) => {
    //Pega as infos da requisição
    const { senderWallet, quantity, receiverWallet } = req.body

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
        await Student.transferMoney(senderWallet, quantity, receiverWallet)

        res.send('Transação realizada com sucesso')
    } catch (err) {
        res.status(500).send("Não foi possível concretizar a transação")
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    getStudent,
    createStudent,
    getWallet,
    deleteStudent,
    checkIn,
    checkOut,
    accesses,
    exits,
    allAccesses,
    allExits,
    balance,
    transferMoney,
}
