const { response } = require('express');
const dbConnection = require('../config/connectionDatabase').dbConnection;

exports.registar = async function (user) {
    console.log("ja estou a registar");
    return new Promise(function (resolve, reject) {
        switch (user.permissions) {
            case "user":
                dbConnection.query("INSERT INTO users SET ?", user,
                    function (err, result) {
                        if (err) {
                            console.log("Deu erro no registo na tabela user");
                            reject({ msg: "Já existe um utilizador com este email" });
                        } else {
                            resolve(result);
                        }
                    }
                );
                break;
            case "company":
                dbConnection.query("INSERT INTO empresas SET ?", user,
                    function (err, result) {
                        if (err) {
                            console.log("Deu erro no registo na tabela empresa" + err);
                            reject({ msg: "Ja existe uma empresa com este email" });
                        } else {
                            resolve(result);
                        }
                    }
                );
                break;
            case "admin":
                dbConnection.query("INSERT INTO admins SET ?", user,
                    function (err, result) {
                        if (err) {
                            console.log("erro no registo na tabela admin" + err);
                            reject({ msg: "Ja existe um administrador com este email" });
                        } else {
                            console.log("correu bem no registo admin");
                            resolve(result);
                        }
                    }
                );
                break;
            default:
                //caso não entre em nenhum dos cases
                console.log("ERRO");
        }
    })
}

exports.alterUserInfo = function (user) {
    console.log("birth: " + user.data_nascimento);
    return new Promise(function (resolve, reject) {
        dbConnection.query(`call alterUserInfo(?, ?, ?, ?, ?, ?, ?)`, [
            user.emailSearch,
            user.newName,
            user.newBirth,
            user.newGenero,
            user.newDescricao,
            user.newLocalidade,
            user.newVistoPorEmpresa
        ], function (err, result) {
            if (err) {
                console.log("correu mal a alterar no user: " + err)
                reject({ msg: "Erro na alteração das informações do utilizador." })
            } else {
                resolve(result)
            }
        })
    })
}

exports.alterCompanyInfo = function (company) {
    return new Promise(function (resolve, reject) {
        dbConnection.query('call alterCompanyInfo(?, ?, ?, ?, ?)', [
            company.emailSearch,
            company.newName,
            company.newDescricao,
            company.newURLEmpresa,
            company.newURLLogo
        ], function (err, result) {
            if (err) {
                console.log("correu mal a alterar na empresa: " + err)
                reject({ msg: "Erro na alteração das informações da empresa." })
            } else {
                resolve(result)
            }
        })
    })
}

exports.getUser = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from users WHERE email = '${email}';`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura do utilizador: " + err);
                } else if (result[0] == null) {
                    err = { message: "Nenhum utilizador com este email!" };
                    reject(err.message);
                } else {
                    console.log("DB getUser- correu tudo bem");
                    resolve(result[0]);
                }
            });
    })
}

exports.getCompany = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from empresas WHERE email = '${email}';`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura da empresa: " + err);
                } else if (result[0] == null) {
                    err = { message: "Nenhuma empresa com este email!" };
                    reject(err.message);
                } else {
                    console.log("DB getCompany- correu tudo bem");
                    resolve(result[0]);
                }
            });
    })
}

exports.getAdmin = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from admins WHERE email = '${email}';`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura do admin: " + err);
                } else if (result[0] == null) {
                    err = { message: "Nenhum admin com este email!" };
                    reject(err.message);
                } else {
                    console.log("DB getAdmin- correu tudo bem");
                    resolve(result[0]);
                }
            });
    })
}

/*
function callback(err, result) {
    if (err) {
        reject("Erro na procura do utilizador: " + err);
    } else if (result[0] == null) {
        err = { message: "Nenhum utilizador com este email!" };
        reject(err.message);
    } else {
        console.log("DB getUser- correu tudo bem");
        resolve(result[0]);
    }
}*/