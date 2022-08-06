const { validationResult } = require('express-validator');
const userService = require('../services/User')
require('express-async-errors')

const createUser = (req, res) => {
    //Pega as infos da requisição
    const { name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser } = req.body;

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    } else {
        //Instancia a classe criando uma vaga
        const user = new userService.User(name, email, password, bornDate, gender, cpf, phoneNumber, typeOfUser);

        //Tratamento das respostas do método da classe
        user.generateUser().then((resul) => {
            if(resul.type === "error") {
                res.status(500).json({
                    error: resul.message
                })
            } else {
                res.status(200).json({
                    message: resul.message
                })
            }
        });

        return user
    }

    
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    createUser
}