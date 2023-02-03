//ver https://moodle.ips.pt/2223/pluginfile.php/143829/mod_resource/content/1/PW16-NODE4-ExpressSGDB.pdf (slide 31)
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/public'));

const options = require('./options.json');
const passport = require('passport');
const port = options.server.port;
const host = options.server.host;

//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //voltar a salvar as variáveis de sessao em caso de alteração: false
    saveUninitialized: false //salvar um valor vazio nesta sessao: false
}))

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/userRoutes')(app);

app.listen(port, function (err) {
    if (err) { console.log(err) };
    console.log("Servidor á escuta em http://%s:%s", host, port);
});

exports.app = app;