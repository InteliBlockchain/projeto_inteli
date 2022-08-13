const { validationResult } = require('express-validator')
const studentService = require('../services/Student')
require('express-async-errors')

const Student = new studentService.Student()

const studentExists = async (req, res) => {
    //Pega as infos da requisição
    const { wallet } = req.params

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
    } else {
        try {
            //Tratamento das respostas do método da classe
            await Student.createStudent(ra)

            res.send("Usuário criado com sucesso")
        } catch (err) {
            
            res.status(400).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

const getWallet = (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.param

    try {
        //Tratamento das respostas do método da classe
        const wallet = await Student.getWallet(ra)
        res.send(wallet)
    } catch (err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }
}

const deleteStudent = (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.param

    //Tratamento das respostas do método da classe
    try {
        //Tratamento das respostas do método da classe
        await Student.removeStudent(ra)
        res.send("Usuário removido com sucesso")
    } catch (err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }

    return Student
}

const CheckIn = (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.body

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
            await Student.checkIn(ra);
            res.send('CheckIn feito com sucesso')
        } catch (err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

const CheckOut = (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.body

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
            await Student.checkOut(ra);
            res.send('CheckOut feito com sucesso')
        } catch(err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

const Accesses = (req, res) => {
    //Pega as infos da requisição
    const { ra, date } = req.body

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
            const times = await Student.accesses(ra, date);

            res.send(times)
        } catch(err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }

        return Student
    }
}

const Exits = (req, res) => {
    //Pega as infos da requisição
    const { ra, date } = req.body

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
            const times = await Student.accesses(ra, date);

            res.send(times);
        } catch(err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

const AllAccesses = (req, res) => {
    //Pega as infos da requisição
    const { date } = req.params

    try {
        const ras = await Student.allAccesses(date);
        res.send(ras)
    } catch(err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }
}

const AllExits = (req, res) => {
    //Pega as infos da requisição
    const { date } = req.params

    try {
        const ras = await Student.allExits(date);
        res.send(ras)
    } catch(err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }
}

const Balance = (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.body

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
            const balance = await Student.balance(ra, date);

            res.send(balance);
        } catch(err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

const transferMoney = (req, res) => {
    //Pega as infos da requisição
    const { raOrigem, quantity, raDestino } = req.body

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
            await Student.transferMoney(raOrigem, quantity, raDestino);

            res.send('Dinheiro Transferido com sucesso');
        } catch(err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    studentExists,
    createStudent,
    getWallet,
    deleteStudent,
    CheckIn,
    CheckOut,
    Accesses,
    Exits,
    AllAccesses,
    AllExits,
    Balance,
    transferMoney
}