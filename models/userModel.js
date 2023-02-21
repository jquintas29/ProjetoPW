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
    const user = {
        emailSearch: req.user.email || null,
        newName: req.body.name || null,
        newData_nascimento: req.body.data_nascimento || null,
        newGenero: req.body.genero || null,
        newDescricao: req.body.descricao || null,
        newLocalidade: req.body.localidade || null,
        newVisto_por_empresas: req.body.visto_por_empresa || null
    }

    dbModel.alterUserInfo(user)
        .then(function (data) {
            console.log("alteração no user feito")
            res.status(200).send(data)
        })
        .catch(function (response) {
            console.log("algo correu mal na alteração do user")
            res.status(500).send(response);
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
            res.status(200).send({ message: "Alteração do perfil da empresa realizado com sucesso" })
        })
        .catch(function (response) {
            console.log("algo correu mal na alteração da empresa")
            res.status(500).send(response);
        })
}

exports.addFriend = async function (req, res) {
    console.log("vim adicionar o amigo")

    dbModel.addFriend(req.body.email, req.user)
        .then(function (data) {
            res.status(201).send({ message: "Pedido enviado" })
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.aceitarPedido = async function (req, res) {
    console.log("vim aceitar o pedido")

    dbModel.aceitarPedido(req.body, req.user)
        .then(function (data) {
            console.log("aceite com sucesso")
            res.status(200).send({ msg: "Pedido aceite com sucesso" })
        })
        .catch(function (response) {
            console.log("deu erro a aceitar pedido")
            res.status(400).send(response)
        })
}

exports.removerProfissional = async function (req, res) {
    dbModel.removerProfissional(req.body.email)
        .then(function (data) {
            res.status(200).send({ msg: "Profissional removido com sucesso!" })
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

exports.aceitarEmpresa = async function (req, res) {
    dbModel.aceitarEmpresa(req.body.email)
        .then(function (data) {
            res.status(200).send({ msg: "Empresa aceite com sucesso!" })
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

exports.removerEmpresa = async function (req, res) {
    dbModel.removerEmpresa(req.body.email)
        .then(function (data) {
            res.status(200).send({ msg: "Empresa removida com sucesso!" })
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

exports.removerAmigo = async function (req, res) {
    dbModel.removerAmigo(req.body.id)
        .then(function (data) {
            console.log("remoção com sucesso")
            res.status(200).send({ msg: "Amigo removido com sucesso" })
        })
        .catch(function (response) {
            console.log("deu erro a remover amigo")
            res.status(400).send(response)
        })
}

exports.getAllUsers = async function (req, res) {
    if (req.user.role == "company") {
        dbModel.getAllUsersForCompany()
            .then(function (data) {
                res.status(201).send({ data: data, email: req.user.email })
            })
            .catch(function (response) {
                res.status(400).send(response);
            })
    } else {
        dbModel.getAllUsers()
            .then(function (data) {
                res.status(201).send({ data: data, email: req.user.email })
            })
            .catch(function (response) {
                res.status(400).send(response);
            })
    }
}

exports.getAllCompanies = async function (req, res) {
    dbModel.getAllCompanies()
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response);
        })
}

exports.getAllCompaniesWithRequest = function (req, res) {
    dbModel.getAllCompaniesWithRequest()
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response);
        })
}

exports.getFriends = async function (req, res) {
    dbModel.getFriends(req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.getFriendsRequests = async function (req, res) {
    dbModel.getFriendsRequests(req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

exports.userWorkExperience = async function (req, res) {
    dbModel.userWorkExperience(req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.addWork = async function (req, res) {
    const work = {
        localname: req.body.localname,
        logourl: req.body.logourl,
        startdate: req.body.startdate || null,
        enddate: req.body.enddate || null,
        jobdescription: req.body.jobdescription
    }
    dbModel.addWork(work, req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.editWork = async function (req, res) {
    const work = {
        id: req.body.id,
        localname: req.body.localname,
        logourl: req.body.logourl,
        startdate: req.body.startdate || null,
        enddate: req.body.enddate || null,
        jobdescription: req.body.jobdescription
    }
    dbModel.editWork(work)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.removerTrabalho = async function (req, res) {
    dbModel.removerTrabalho(req.body.id)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.userAcademicFormation = async function (req, res) {
    dbModel.userAcademicFormation(req.user.email)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.addFormation = async function (req, res) {
    dbModel.addFormation(req.body, req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.editFormation = async function (req, res) {
    dbModel.editFormation(req.body)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.removerFormacao = async function (req, res) {
    dbModel.removerFormacao(req.body.id)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.addVaga = async function (req, res) {
    dbModel.addVaga(req.body)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

exports.getVagas = async function (req, res) {
    dbModel.getVagas()
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
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
