const { response } = require('express');
const dbConnection = require('../config/connectionDatabase').dbConnection;

exports.registar = async function (email, nome, password, role) {
    console.log("ja estou a registar");
    const user = {
        email: email,
        name: nome,
        password: password,
        permissions: role
    }

    return new Promise(function (resolve, reject) {
        if (role == "user") {
            dbConnection.query("INSERT INTO users SET ?", user,
                function (err, result) {
                    if (err) {
                        console.log("Deu erro no registo na tabela user")
                        reject({ msg: "Já existe um utilizador com este email" });
                    } else {
                        dbConnection.query("INSERT INTO registos SET users_email=?", user.email,
                            function (err, result) {
                                if (err) {
                                    reject({ msg: "Ja existe um utilizador com este email" });
                                }
                                console.log("correu tudo bem na tabela registos") //para debug
                            });
                        resolve(result);
                    }
                });
        } else if (role == "companie") {
            dbConnection.query("INSERT INTO empresas SET ?", user,
                function (err, result) {
                    if (err) {
                        console.log("Deu erro no registo na tabela empresa")
                        reject({ msg: "Ja existe uma empresa com este email" });
                    } else {
                        dbConnection.query("INSERT INTO registos SET empresas_email=?", user.email,
                            function (err, result) {
                                if (err) {
                                    reject({ msg: "Ja existe uma empresa com este email" });
                                }
                                console.log("correu tudo bem na tabela de registos");
                            });
                        resolve(result);
                    }
                });
        } else if (role == "admin") {
            dbConnection.query("INSERT INTO admins SET ?", user, function (err, result) {
                if (err) {
                    console.log("erro no registo na tabela admin" + err)
                    reject({ msg: "Ja existe um administrador com este email" });
                } else {
                    console.log("correu bem no registo admin")
                    resolve(result);
                }
            });
        }
    })
}

exports.getUser = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select users.* from users 
                            left join registos on users.email = registos.users_email
                            WHERE users.email = '${email}' ;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura do utilizador: " + err);
                } else if (result[0] == null) {
                    err = { message: "Nenhum utilizador com este email ! " };
                    reject(err.message);
                } else {
                    console.log("DB getUser- correu tudo bem");
                    resolve(result[0]);
                }
            });
    })
}

exports.getCompanie = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from empresas 
                            left join registos on empresas.email = registos.empresas_email
                            WHERE empresas.email =  '${email}' ;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura da empresa: " + err);
                } else if (result[0] == null) {
                    err = { message: "Nenhuma empresa com este email ! " };
                    reject(err.message);
                } else {
                    console.log("DB getCompanie- correu tudo bem");
                    resolve(result[0]);
                }
            });
    })
}

exports.getAdmin = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from admins WHERE email =  '${email}' ;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura do admin: " + err);
                } else if (result[0] == null) {
                    err = { message: "Nenhum admin com este email ! " };
                    reject(err.message);
                } else {
                    console.log("DB getAdmin- correu tudo bem");
                    resolve(result[0]);
                }
            });
    })
}