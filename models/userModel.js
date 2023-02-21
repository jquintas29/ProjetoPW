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

/**
 * Regista o utilizador
 * @param {*} req 
 * @param {*} res 
 */
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
            res.status(201).send({ message: "Registo feito com sucesso" });
        })
        .catch(function (response) {
            res.status(400).send(response);
        })
};

/**
 * Altera a informação do utilizador
 * @param {*} req 
 * @param {*} res 
 */
exports.alterUserInfo = async function (req, res) {
    const user = {
        emailSearch: req.user.email || null,
        newName: req.body.name || null,
        newData_nascimento: req.body.data_nascimento || null,
        newGenero: req.body.genero || null,
        newDescricao: req.body.descricao || null,
        newLocalidade: req.body.localidade || null,
        newVisto_por_empresas: req.body.visto_por_empresa
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

/**
 * Altera a informação da empresa
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Pedido de amizade a um utilizador
 * @param {*} req 
 * @param {*} res 
 */
exports.addFriend = async function (req, res) {
    dbModel.addFriend(req.body.email, req.user)
        .then(function (data) {
            res.status(201).send({ message: "Pedido enviado" })
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

/**
 * Aceitação de um pedido de amizade
 * @param {*} req 
 * @param {*} res 
 */
exports.aceitarPedido = async function (req, res) {
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

/**
 * Remoção de um profissional
 * @param {*} req 
 * @param {*} res 
 */
exports.removerProfissional = async function (req, res) {
    dbModel.removerProfissional(req.body.email)
        .then(function (data) {
            res.status(200).send({ msg: "Profissional removido com sucesso!" })
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Aceitação de uma empresa
 * @param {*} req 
 * @param {*} res 
 */
exports.aceitarEmpresa = async function (req, res) {
    dbModel.aceitarEmpresa(req.body.email)
        .then(function (data) {
            res.status(200).send({ msg: "Empresa aceite com sucesso!" })
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Remoção de uma empresa
 * @param {*} req 
 * @param {*} res 
 */
exports.removerEmpresa = async function (req, res) {
    dbModel.removerEmpresa(req.body.email)
        .then(function (data) {
            res.status(200).send({ msg: "Empresa removida com sucesso!" })
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Remoção de um amigo
 * @param {*} req 
 * @param {*} res 
 */
exports.removerAmigo = async function (req, res) {
    dbModel.removerAmigo(req.body.id)
        .then(function (data) {
            console.log("remoção com sucesso")
            res.status(200).send({ msg: "Amigo removido com sucesso" })
        })
        .catch(function (response) {
            console.log("deu erro a remover amigo")
            res.status(500).send(response)
        })
}

/**
 * Obtém a lista de usuários e envia a informação. Empresas só vêm os utilizadores que querem ser vistos por elas
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Obtém a lista de todas as empresas e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllCompanies = async function (req, res) {
    dbModel.getAllCompanies()
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response);
        })
}

/**
 * Obtém a lista de todas as empresas que ainda têm pedido de registo pendente e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllCompaniesWithRequest = function (req, res) {
    dbModel.getAllCompaniesWithRequest()
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response);
        })
}

/**
 * Obtém os amigos do usuário e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.getFriends = async function (req, res) {
    dbModel.getFriends(req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

/**
 * Obtém os pedidos de amizade do utilizador e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.getFriendsRequests = async function (req, res) {
    dbModel.getFriendsRequests(req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Obtém a experiencia profissional do utilizador e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.userWorkExperience = async function (req, res) {
    dbModel.userWorkExperience(req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Obtém a experiencia profissional que se quer adicionar ao perfil
 * @param {*} req 
 * @param {*} res 
 */
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
            res.status(500).send(response)
        })
}

/**
 * Obtém a edição que se quer fazer na experiencia profissional
 * @param {*} req 
 * @param {*} res 
 */
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
            res.status(500).send(response)
        })
}

/**
 * Obtém a experiencia profissional que se quer remover ao perfil
 * @param {*} req 
 * @param {*} res 
 */
exports.removerTrabalho = async function (req, res) {
    dbModel.removerTrabalho(req.body.id)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Obtém a formação academica do utilizador e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.userAcademicFormation = async function (req, res) {
    dbModel.userAcademicFormation(req.user.email)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Obtém a formação academica que se quer adicionar ao perfil e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.addFormation = async function (req, res) {
    dbModel.addFormation(req.body, req.user.email)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Obtém a edição que se quer fazer na formação academica e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.editFormation = async function (req, res) {
    dbModel.editFormation(req.body)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

/**
 * Obtém a formação academica que se quer remover ao perfil e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.removerFormacao = async function (req, res) {
    dbModel.removerFormacao(req.body.id)
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(500).send(response)
        })
}

/**
 * Obtém a vaga que se quer adicionar e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.addVaga = async function (req, res) {
    dbModel.addVaga(req.body)
        .then(function (data) {
            res.status(201).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

/**
 * Obtém as vagas e envia a informação
 * @param {*} req 
 * @param {*} res 
 */
exports.getVagas = async function (req, res) {
    dbModel.getVagas()
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (response) {
            res.status(400).send(response)
        })
}

/**
 * Faz logout da sessão e executa a função next mandada por parametro
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.logout = function (req, res, next) {
    if (req.isUnauthenticated()) {
        return res.redirect('/')
    }
    req.logout(function (err) {
        if (err) { return next(err) };
        res.redirect('/');
    });
}

/**
 * verifica se um utilzador esta autenticado, se houver é executada a função next mandada por parametro, caso contrario é refirecionado para a pagina de login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Check: true- autenticado");
        return next();
    }
    console.log("Check: false- nao autenticado");
    res.redirect('/login')
}

/**
 * verifica se um utilzador esta autenticado, se não houver é executada a função next mandada por parametro, caso contrario é refirecionado para a pagina principal
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.checkNotAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("CheckNot: false- autenticado");
        return res.redirect('/');
    }
    console.log("CheckNot: true- nao autenticado");
    next();
}
