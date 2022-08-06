const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const userController = require('../controllers/User')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')



//ROUTAS com seus respectivos controlers e middlewares
router.post('/Register',
[
body('name', 'Nome é necessário').exists({checkFalsy: true}),
body('email', 'Email é necessário').exists({checkFalsy: true}), 
body('password', 'Senha é necessária').exists({checkFalsy: true}),
body('bornDate', 'Data de nascimento é necessária').exists({checkFalsy: true}),
body('gender', 'Genêro é necessária').exists({checkFalsy: true}),
body('cpf', 'CPF é necessária').exists({checkFalsy: true}),
body('phoneNumber', 'Número de telefone é necessário').exists({checkFalsy: true}),
], userController.createUser)

router.post('/Login',
[body('email', 'Email é necessário').exists({checkFalsy: true}), body('password', 'Senha é necessária').exists({checkFalsy: true})], 
userController.AuthUser)

router.put('/Update', userAuth.unsureAuthenticated, userController.UpdateUser)

router.delete('/Delete', userAuth.unsureAuthenticated, userController.deleteUser)

router.get('/Verify/Curriculum', userAuth.unsureAuthenticated, userController.verifyCurriculum)

router.post('/User', userAuth.unsureAuthenticated, userController.getUser)

router.get('/Users', userAuth.unsureAuthenticated, userController.getUsers)

router.get('/Verify/Infos', userAuth.unsureAuthenticated, userController.getInfos)

router.put('/Update/Permission', userAuth.unsureAuthenticated, adminAuth.ensureAdmin, 
[body('id', 'ID é necessário').exists({checkFalsy: true}), body('isAdmin', 'isAdmin é necessário').exists({checkFalsy: true})],
userController.updatePermission)

router.post('/Reset/Password', 
[body('email', 'Email é necessário').exists({checkFalsy: true})],
userController.resetPassWord)

router.put('/Redefine/Password',
[
body('email', 'Email é necessário').exists({checkFalsy: true}),
body('code', 'Código é necessário').exists({checkFalsy: true}),
body('newPass', 'Nova senha é necessária').exists({checkFalsy: true}) 
], userController.redefinePassWord)

router.post('/VerifyAccount', userAuth.unsureAuthenticated,
[body('token', 'Código é necessário').exists({checkFalsy: true})], userController.verifyAccount)

router.get('/VerifyCode', userAuth.unsureAuthenticated, userController.verifyCode)

router.post('/SendNotify', userAuth.unsureAuthenticated, 
[body('qntVagas', 'Quantidade de vagas é necessário').exists({checkFalsy: true})], userController.sendNotification)

router.delete('/Delete/Admin', userAuth.unsureAuthenticated, adminAuth.ensureAdmin,
[body('id', 'ID de um usuário é necessário').exists({checkFalsy: true})], userController.deleteUsers)

//Exporta o ROUTER
module.exports = router