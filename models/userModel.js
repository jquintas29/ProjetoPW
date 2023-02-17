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

    //encriptação da password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = {
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        permissions: req.body.role
    }

    dbModel.registar(user)
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

exports.alterUserInfo = async function (req, res) {
    console.log("vim alterar a info do user")
    console.log("email do user: " + JSON.stringify(req.body))
    const usr = {
        emailSearch: req.user.email || null,
        newName: req.body.name || null,
        newData_nascimento: req.body.data_nascimento || null,
        newGenero: req.body.genero || null,
        newDescricao: req.body.descricao || null,
        newLocalidade: req.body.localidade || null,
        newVisto_por_empresas: req.body.visto_por_empresa || null
    }

    dbModel.alterUserInfo(usr)
        .then(function (data) {
            console.log("alteração no user feito")
            res.status(201).send(data)
        })
        .catch(function (response) {
            console.log("algo correu mal na alteração do user")
            res.status(400).send(response);
        })
}

exports.alterCompanyInfo = async function (req, res) {
    console.log("vim alterar a info da empresa")
    const company = {
        emailSearch: req.user.email || null,
        newName: req.body.name || null,
        newDescricao: req.body.descricao || null,
        newURLEmpresa: req.body.URLEmpresa || null,
        newURLLogo: req.body.URLLogo || null
    }

    dbModel.alterCompanyInfo(company)
        .then(function (data) {
            console.log("alteração na empresa feito")
            res.status(201).send({ message: "Alteração do perfil da empresa realizado com sucesso" })
        })
        .catch(function (response) {
            console.log("algo correu mal na alteração da empresa")
            res.status(400).send(response);
        })
}

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
