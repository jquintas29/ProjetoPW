const dbModel = require('./dbModel');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { response } = require('express');

const initializePassport = require('../config/passport-config');
/**
 * inicializa o passaporte passando como parametro o passaport 
 * e as função para procurar o utilizador na base de dados.
 */
initializePassport(passport, dbModel.getUser, dbModel.getCompany, dbModel.getAdmin);

exports.registar = async function (req, res) {
    console.log("a registar utilizador");
    console.log(req.body);
    const email = req.body.email;
    const nome = req.body.name;
    const role = req.body.role;

    //encriptação da password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    dbModel.registar(email, nome, hashedPassword, role)
        .then(function (data) {
            console.log("registo feito");
            //res.json('Utilizador registado com sucesso')
            res.status(201).send({ message: "Registo feito com sucesso" });
        })
        .catch(function (response) {
            //se nao for possivel criar o novo utilizador
            console.log("deu erro a registar")
            console.log("resposta da query: " + response.msg)
            res.status(400).send(response);
        })
};

exports.logout = function (req, res, next) {
    if (req.isUnauthenticated()) {
        return res.redirect('/')
    }
    req.logout(function (err) {
        if (err) { return next(err) };
        res.redirect('/');
    });
}

exports.checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Check: true- autenticado");
        return next();
    }
    console.log("Check: false- nao autenticado");
    res.redirect('/login')
}

exports.checkNotAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("CheckNot: false- autenticado");
        return res.redirect('/');
    }
    console.log("CheckNot: true- nao autenticado");
    next();
}
