const passport = require('passport');

module.exports = app => {
    const userModel = require('../models/userModel');
    const router = require('express').Router();

    router.get("/", (req, res) => res.render('index.ejs'));

    router.get('/vagas', (req, res) => res.render('views/vagas.ejs'));

    router.get('/procurar', userModel.checkAuthenticated, (req, res) => res.render('views/procurar.ejs'));
    router.post('/procurarUsers', userModel.getAllUsers);
    router.post('/procurarEmpresas', userModel.getAllCompanies);
    router.post('/procurarEmpresasComRequest', userModel.getAllCompaniesWithRequest);

    router.post('/userFriends', userModel.getFriends)
    router.post('/userFriendsRequests', userModel.getFriendsRequests)

    router.get('/formvaga', (req, res) => res.render('views/formVaga.ejs'));
    router.post('/formvaga', userModel.addVaga); 
    router.get('/getVagas', userModel.getVagas)

    router.put('/alterUser', userModel.alterUserInfo);
    router.put('/alterCompany', userModel.alterCompanyInfo);

    router.put('/aceitarEmpresa', userModel.aceitarEmpresa)
    router.delete('/removerEmpresa', userModel.removerEmpresa)
    router.delete('/removerProfissional', userModel.removerProfissional)
    router.delete('/removerAmigo', userModel.removerAmigo)
    router.post('/addFriend', userModel.addFriend)
    router.put('/aceitarPedido', userModel.aceitarPedido)

    router.post('/userWorkExperience', userModel.userWorkExperience)
    router.post('/addWork', userModel.addWork)
    router.put('/editWork', userModel.editWork)
    router.delete('/removerTrabalho', userModel.removerTrabalho)

    router.post('/userAcademicFormation', userModel.userAcademicFormation)
    router.post('/addFormation', userModel.addFormation)
    router.put('/editFormation', userModel.editFormation)
    router.delete('/removerFormacao', userModel.removerFormacao)

    router.get('/sobrenos', (req, res) => res.render('views/Sobre_nos.ejs'));

    //permite buscar as informações guardadas na sessão
    router.get('/api/session', (req, res) => res.send({ user: req.user }));

    //se registado com sucesso é redirecionado para GET /registar
    router.post('/registar', userModel.registar);
    router.get('/registar', (req, res) => {
        res.render("views/registar.ejs")
    });

    //verifica se o utilizador ja tem a sessao iniciada e renderiza o formulário de login
    router.get('/login', (req, res) => { res.render("views/login.ejs") });
    router.post('/login', userModel.checkNotAuthenticated, passport.authenticate('local', {
        //local é uma estrategia definida para fazer autenticação pelo username e password
        successRedirect: '/perfil',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.get('/logout', userModel.logout);

    //verifica se o utilizador ja tem a sessao iniciada e renderiza o perfil de utilizador, empresa, ou admin
    router.get('/perfil', userModel.checkAuthenticated, (req, res) => res.render('views/perfil.ejs', {
        name: req.user.name,
        genero: req.user.genero,
        localidade: req.user.localidade,
        descricao: req.user.descricao,
        role: req.user.role,
        nascimento: req.user.dataNascimento,
        URLEmpresa: req.user.URLEmpresa,
        URLLogo: req.user.URLLogo
    }))

    app.use('/', router);
};