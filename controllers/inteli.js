const { validationResult } = require('express-validator')
const inteliService = require('../services/inteli.js')
require('express-async-errors')

const Balance = (req, res) => {
    //Pega as infos da requisição
    const { ra } = req.params

    try {
        //Instancia a classe criando uma vaga
        const Inteli = new inteliService.Inteli()

        //Tratamento das respostas do método da classe
        const balance = await Inteli.balance(ra);

        res.send(balance);
    } catch(err) {
        res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
    }
    
}

const rewardStudent = (req, res) => {
    //Pega as infos da requisição
    const { quantity, raStudent } = req.body

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
            const Inteli = new inteliService.Inteli()

            //Tratamento das respostas do método da classe
            await Inteli.transferMoney(quantity, raStudent);

            res.send('Dinheiro Transferido com sucesso');
        } catch(err) {
            res.status(500).send('Solicitação não autorizada! Tente novamente mais tarde')
        }
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    Balance,
    rewardStudent
}