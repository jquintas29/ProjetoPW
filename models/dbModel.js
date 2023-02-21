const { restart } = require('nodemon');

const dbConnection = require('../config/connectionDatabase').dbConnection;

exports.registar = async function (user) {
    console.log("ja estou a registar");
    return new Promise(function (resolve, reject) {
        switch (user.permissions) {
            case "user":
                dbConnection.query("INSERT INTO users SET ?", user,
                    function (err, result) {
                        if (err) {
                            console.log("Deu erro no registo na tabela user"); //para debug
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
                            console.log("Deu erro no registo na tabela empresa" + err); //para debug
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
                            console.log("erro no registo na tabela admin" + err); //para debug
                            reject({ msg: "Ja existe um administrador com este email" });
                        } else {
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
    console.log("email BD: ", user.emailSearch)
    console.log("visto por empresas BD: ", user.newVisto_por_empresas)
    return new Promise(function (resolve, reject) {
        dbConnection.query(`call alterUserInfo(?, ?, ?, ?, ?, ?, ?)`, [
            user.emailSearch,
            user.newName,
            user.newBirth,
            user.newGenero,
            user.newDescricao,
            user.newLocalidade,
            user.newVisto_por_empresas
        ], function (err, result) {
            if (err) {
                console.log("correu mal a alterar no user: " + err)
                reject({ msg: "Erro na alteração das informações do utilizador: " + err })
            } else {
                console.log(result)
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
                reject({ msg: "Erro na alteração das informações da empresa: " + err })
            } else {
                resolve(result)
            }
        })
    })
}

exports.addFriend = async function (email, reqUser) {
    const user = await this.getUser(email)

    return new Promise(function (resolve, reject) {
        dbConnection.query(`Insert into amigos (email_amigo, nome, aceitacao, nome_user, users_email)
         value ("${user.email}", "${user.name}", 2, "${reqUser.name}", "${reqUser.email}");`,
            function (err, result) {
                if (err) {
                    console.log("Erro ao adicionar amigo: " + err);
                    reject({ msg: "Erro ao adicionar amigo: " + err })
                } else {
                    resolve(result);
                }
            })
    })
}

exports.aceitarPedido = async function (friendToAdd, currentUser) {
    const user = await this.getUser(friendToAdd.email)

    return new Promise(function (resolve, reject) {
        dbConnection.query(`update amigos set aceitacao = 1 where id = "${friendToAdd.id}";`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a aceitar pedido: " + err)
                    reject({ msg: "Erro a aceitar pedido: " + err })
                } else {
                    dbConnection.query(`Insert into amigos (email_amigo, nome, aceitacao, nome_user, users_email)
                    value ("${user.email}", "${user.name}", 1, "${currentUser.name}", "${currentUser.email}");`,
                        function (err, result) {
                            if (err) {
                                console.log("Erro ao adicionar amigo apos aceitação: " + err);
                                reject({ msg: "Erro ao adicionar amigo apos aceitação: " + err })
                            } else {
                                resolve(result);
                            }
                        })

                    resolve(result)
                }
            })
    })
}

exports.removerProfissional = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`delete from users where email = "${email}" and status = 1`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a remover profissional: " + err)
                    reject({ msg: "Erro a remover profissional: " + err })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.aceitarEmpresa = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`update empresas set status = 1 where email = "${email}"`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a aceitar empresa: " + err)
                    reject({ msg: "Erro a aceitar empresa: " + err })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.removerEmpresa = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`delete from empresas where email = "${email}"`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a remover empresa: " + err)
                    reject({ msg: "Erro a remover empresa: " + err })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.removerAmigo = async function (relashionID) {
    const relashion = await this.getrelationship(relashionID)

    return new Promise(function (resolve, reject) {
        dbConnection.query(`delete from amigos where id = ${relashion[0][0].id} or id = ${relashion[0][1].id};`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a remover amigo: " + err)
                    reject({ msg: "Erro a remover amigo" })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.getrelationship = function (relashionID) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`call getRelashionship(${relashionID});`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a ir buscar a relação: " + err)
                    reject({ msg: "Erro na na busca da relação." })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.getAllUsers = function () {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from users;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura dos utilizadores: " + err);
                } else {
                    console.log("DB getAllUser- correu tudo bem");
                    resolve(result);
                }
            });
    })
}

exports.getAllUsersForCompany = function () {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from users where visto_por_empresa = '1';`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura dos utilizadores: " + err);
                } else {
                    console.log("DB getAllUser- correu tudo bem");
                    resolve(result);
                }
            });
    })
}

exports.getAllCompanies = function () {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from empresas where status = 1;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura das empresas: " + err);
                } else {
                    console.log("DB getAllCompanies- correu tudo bem");
                    resolve(result);
                }
            });
    })
}

exports.getAllCompaniesWithRequest = function () {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from empresas where status = 2;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura das empresas: " + err);
                } else {
                    console.log("DB getAllCompanies- correu tudo bem");
                    resolve(result);
                }
            });
    })
}

exports.getFriends = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from amigos WHERE users_email = '${email}' and aceitacao = 1;`,
            function (err, result) {
                if (err) {
                    console.log("Erro na procura dos amigos: " + err);
                    reject({ msg: "erro na procura dos amigos: " + err })
                } else if (result == 0) {
                    reject({ msg: "Sem amigos adicionados" });
                } else {
                    resolve(result);
                }
            })
    })
}

exports.getFriendsRequests = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from amigos WHERE email_amigo = '${email}' and aceitacao = 2;`,
            function (err, result) {
                if (err) {
                    console.log("Erro na procura dos pedidos: " + err);
                    reject({ msg: "erro na procura dos pedidos: " + err })
                } else if (result == 0) {
                    reject({ msg: "Sem pedidos de amizade" });
                } else {
                    resolve(result);
                }
            })
    })
}

exports.userWorkExperience = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from trabalhos where users_email = "${email}"`,
            function (err, result) {
                if (err) {
                    console.log("Erro na procura dos trabalhos: " + err);
                    reject({ msg: "Erro na procura dos trabalhos: " + err })
                } else if (result == 0) {
                    reject({ msg: "Sem trabalhos adicionados" });
                } else {
                    resolve(result);
                }
            })
    })
}

exports.addWork = function (work, email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`insert into trabalhos (url, name, data_inicio, data_fim, descricao, users_email) 
        value (?, ?, ?, ?, ?, ?)`, [work.logourl, work.localname, work.startdate, work.enddate, work.jobdescription, email],
            function (err, result) {
                if (err) {
                    console.log("correu mal a adicionar trabalho: " + err)
                    reject({ msg: "Erro na adição do trabalho: " + err })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.editWork = function (workEdit) {
    console.log(workEdit)
    return new Promise(function (resolve, reject) {
        dbConnection.query(`update trabalhos set url = ?, name= ?, data_inicio = ?, data_fim = ?, descricao = ? where id =?;`,
            [workEdit.logourl, workEdit.localname, workEdit.startdate, workEdit.enddate, workEdit.jobdescription, workEdit.id],
            function (err, result) {
                if (err) {
                    console.log("correu mal a alterar trabalho: " + err)
                    reject({ msg: "Erro na alteração do trabalho: " + err })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.removerTrabalho = function (id) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`delete from trabalhos where id = "${id}"`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a remover trabalho: " + err)
                    reject({ msg: "Erro a remover trabalho: " + err })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.userAcademicFormation = function (email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from formacoes where users_email = "${email}"`,
            function (err, result) {
                if (err) {
                    console.log("Erro na procura das formações: " + err);
                    reject({ msg: "Erro na procura das formações: " + err })
                } else if (result == 0) {
                    reject({ msg: "Sem formações adicionados" });
                } else {
                    resolve(result);
                }
            })
    })
}

exports.addFormation = function (formation, email) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`insert into formacoes (estabelecimento, curso, tipo_curso, media, users_email) 
        value (?, ?, ?, ?, ?)`, [formation.establishmentName, formation.coursename, formation.coursetype, formation.courseaverage, email],
            function (err, result) {
                if (err) {
                    console.log("correu mal a adicionar formação: " + err)
                    reject({ msg: "Erro na adição da formação: " + err })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.editFormation = function (formationEdit) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`update formacoes set
        estabelecimento= "${formationEdit.establishmentName}" ,
        curso = "${formationEdit.coursename}",
        tipo_curso = "${formationEdit.coursetype}",
        media = "${formationEdit.courseaverage}"
        where id =${formationEdit.id};`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a alterar formação: " + err)
                    reject({ msg: "Erro na alteração da formação." })
                } else {
                    resolve(result)
                }
            })
    })
}

exports.removerFormacao = function (id) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`delete from formacoes where id = "${id}"`,
            function (err, result) {
                if (err) {
                    console.log("correu mal a remover formação: " + err)
                    reject({ msg: "Erro a remover formação: " + err })
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
    console.log(email)
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from empresas WHERE email = '${email}' and status = 1;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura da empresa: " + err);
                } else if (result[0] == null) {
                    console.log("nenhuma empresa encontrada: " + result[0])
                    err = { message: "Nenhuma empresa com este email! Se já registou com este email aguarde que um administrador aceite o pedido" };
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

exports.addVaga = function (vaga) {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`insert into vagas ?`, vaga,
            function (err, result) {
                if (err) {
                    console.log("erro no registo da vaga" + err);
                    reject(err);
                } else {
                    console.log("correu bem no registo da vaga");
                    resolve(result);
                }
            })
    })
}

exports.getVagas = function () {
    return new Promise(function (resolve, reject) {
        dbConnection.query(`select * from vagas;`,
            function (err, result) {
                if (err) {
                    reject("Erro na procura das vagas: " + err);
                } else {
                    console.log("DB getVagas- correu tudo bem");
                    resolve(result);
                }
            });
    })
}