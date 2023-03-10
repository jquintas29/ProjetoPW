const localStrategy = require('passport-local');
const bcrypt = require('bcrypt');

function initializePassport(passport, getUserByEmail, getCompanyByEmail, getAdminByEmail) {
    console.log("initializePassport- initialized");

    const authenticateUser = async function (req, emailLogin, passwordLogin, done) {
        console.log("\nA autenticar o user")
        //testa o papel que o usuario introduziu e vai buscar a função para esse papel
        const getUserFunction = checkRole(req.body.role);
        //procura na base de dados o utilizador pelo email
        getUserFunction(emailLogin)
            .then(async function (user) {
                if (await bcrypt.compare(passwordLogin, user.password)) {
                    return done(null, user);
                } else {
                    console.log("password errada")
                    return done(null, false, { message: 'Password incorreta!' });
                }
            })
            .catch(function (err) {
                console.log("deu erro a autenticar")
                return done(null, false, err)
            });
    }

    const checkRole = function (role) {
        if (role == "admin") {
            return getAdminByEmail;
        } else if (role == "user") {
            return getUserByEmail;
        } else {
            return getCompanyByEmail;
        }
    }

    /**
    * usernameField serve para indicar ao construtor de LocalStrategy que queremos 
    * usar o campo html com id=emailLogin como nome de utilizador para autenticação.
    * O mesmo acontece para passwordField.
    * 
    * usernameField e passwordField tem que ser igual ao nome atribuido no campo html onde é introduzido os dados.
    */
    passport.use(new localStrategy({
        usernameField: 'emailLogin',
        passwordField: 'passwordLogin',
        passReqToCallback: true
    }, authenticateUser));

    //serializeUser permite guardar as informações de um usuário na sessão
    //neste caso é guardado apenas as informações necessárias
    passport.serializeUser(function (user, done) {
        console.log("\nserializeUser- SERIALIZEI");
        console.log(user) //para debug
        let userInfo = {
            email: user.email,
            name: user.name,
            role: user.permissions,
            genero: user.genero,
            localidade: user.localidade,
            descricao: user.descricao,
            dataNascimento: user.data_nascimento
        }
        done(null, userInfo);
    })

    //esta é uma função que recebe como parametro "user" os dados guardados na sessão,
    // com esses dados é possivel pesquisar na base de dados pelos restantes dados desse utilizador
    passport.deserializeUser(async function (session, done) {
        console.log("\ndeserializeUser- DESCERIALIZEI");
        //vai buscar a função para procurar na base de dados conforme o papel do usuário
        const getUserFunction = checkRole(session.role)
        //procura na base de dados pelo usuário
        const user = await getUserFunction(session.email)
        //atribui apenas as informações necessárias 
        console.log(user)       
        let birth
        if (user.data_nascimento != null) {
            birth = new Date(user.data_nascimento)
            birth = `${birth.getDate()}/${birth.getMonth() + 1}/${birth.getFullYear()}`
        }
        userInfo = {
            email: user.email,
            name: user.name,
            role: user.permissions,
            genero: user.genero,
            localidade: user.localidade,
            descricao: user.descricao,
            dataNascimento: birth || null,
            URLEmpresa: user.URL_empresa,
            URLLogo: user.URL_logo
        }
        return done(null, userInfo)
    })
}

module.exports = initializePassport