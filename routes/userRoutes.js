const passport = require('passport');

module.exports = app => {
    const userModel = require('../models/userModel');
    const router = require('express').Router();

    router.get("/", (req, res) => { res.render('index.ejs'); });

    router.get('/vagas', (req, res) => res.render('views/vagas.ejs'));

    router.get('/formvaga', (req, res) => res.render('views/formVaga.ejs'));
    router.post('/formvaga'); //fazer a validação do formulário

    router.put('/alterUser', userModel.alterUserInfo);
    router.put('/alterCompany', userModel.alterCompanyInfo);

    router.get('/sobrenos', (req, res) => res.render('views/Sobre_nos.ejs'));

    //permite buscar as informações guardadas na sessão
    router.get('/api/session', (req, res) => res.send({ user: req.user }));

    //se registado com sucesso é redirecionado para GET /registar
    router.post('/registar', userModel.registar);
    router.get('/registar', (req, res) => res.render("views/registar.ejs"));

    //verifica se o utilizador ja tem a sessao iniciada e renderiza o formulário de login
    router.get('/login', (req, res) => { res.render("views/login.ejs") });
    router.post('/login', userModel.checkNotAuthenticated, passport.authenticate('local', {
        //local é uma estrategia definida para fazer autenticação pelo username e password
        successRedirect: '/perfil',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.get('/logout', userModel.logout);

    //verifica se o utilizador ja tem a sessao iniciada e renderiza o perfil de utilizador, ou empresa, ou admin
    router.get('/perfil', userModel.checkAuthenticated, (req, res) =>{ 
        console.log("vim mostrar o perfil")
        console.log(req.user)
        res.render('views/perfil.ejs', {
        name: req.user.name,
        genero: req.user.genero,
        localidade: req.user.localidade,
        descricao: req.user.descricao,
        nascimento: req.user.dataNascimento,
        URLEmpresa: req.user.URLEmpresa,
        URLLogo: req.user.URLLogo
    })})

    app.use('/', router);
};