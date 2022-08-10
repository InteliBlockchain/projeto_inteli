const { validationResult } = require('express-validator')
const studentService = require('../services/Student')
require('express-async-errors')

// const studentExists = async (req, res) => {
//     //Pega as infos da requisição
//     const { wallet } = req.params

//     //Instancia a classe criando uma vaga
//     const Student = new studentService.Student()

//     try {
//         //Tratamento das respostas do método da classe
//         const wallet = await Student.getStudent(wallet)
//         res.send(wallet)
//     } catch (err) {
//         res.status(500).send()
//     }
// }

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
            //Instancia a classe criando uma vaga
            const Student = new studentService.Student()

            //Tratamento das respostas do método da classe
            await Student.createStudent(ra)

            res.send()
        } catch (err) {
            
            res.status(400).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

const getWallet = (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.param

    //Instancia a classe criando uma vaga
    const Student = new studentService.Student()

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

    //Instancia a classe criando uma vaga
    const Student = new studentService.Student()

    //Tratamento das respostas do método da classe
    Student.deleteStudent(ra).then((resul) => {
        if (resul.type === 'error') {
            res.status(500).json({
                error: resul.message,
            })
        } else {
            res.status(200).json({
                message: resul.message,
            })
        }
    })

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
        //Instancia a classe criando uma vaga
        const Student = new studentService.Student()

        //Tratamento das respostas do método da classe
        Student.checkIn(ra).then((resul) => {
            if (resul.type === 'error') {
                res.status(500).json({
                    error: resul.message,
                })
            } else {
                res.status(200).json({
                    message: resul.message,
                })
            }
        })

        return Student
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
        //Instancia a classe criando uma vaga
        const Student = new studentService.Student()

        //Tratamento das respostas do método da classe
        Student.checkOut(ra).then((resul) => {
            if (resul.type === 'error') {
                res.status(500).json({
                    error: resul.message,
                })
            } else {
                res.status(200).json({
                    message: resul.message,
                })
            }
        })

        return Student
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
        //Instancia a classe criando uma vaga
        const Student = new studentService.Student()

        //Tratamento das respostas do método da classe
        Student.accesses(ra, date).then((resul) => {
            if (resul.type === 'error') {
                res.status(500).json({
                    error: resul.message,
                })
            } else {
                res.status(200).json({
                    message: resul.message,
                })
            }
        })

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
        //Instancia a classe criando uma vaga
        const Student = new studentService.Student()

        //Tratamento das respostas do método da classe
        Student.accesses(ra, date).then((resul) => {
            if (resul.type === 'error') {
                res.status(500).json({
                    error: resul.message,
                })
            } else {
                res.status(200).json({
                    message: resul.message,
                })
            }
        })

        return Student
    }
}

const AllAccesses = (req, res) => {
    //Pega as infos da requisição
    const { date } = req.params

    //Instancia a classe criando uma vaga
    const Student = new studentService.Student()

    //Tratamento das respostas do método da classe
    Student.allAccesses(date).then((resul) => {
        if (resul.type === 'error') {
            res.status(500).json({
                error: resul.message,
            })
        } else {
            res.status(200).json({
                message: resul.message,
            })
        }
    })

    return Student
}

const AllExits = (req, res) => {
    //Pega as infos da requisição
    const { date } = req.params

    //Instancia a classe criando uma vaga
    const Student = new studentService.Student()

    //Tratamento das respostas do método da classe
    Student.allExits(date).then((resul) => {
        if (resul.type === 'error') {
            res.status(500).json({
                error: resul.message,
            })
        } else {
            res.status(200).json({
                message: resul.message,
            })
        }
    })

    return Student
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
}
