
const baseUrl = "http://127.0.0.01:8888";

function registarUser() {
    console.log("entrei na função de registo") //para debug
    const email = document.getElementById('emailRegistar').value
    const name = document.getElementById('nameRegistar').value
    const password = document.getElementById('passwordRegistar').value
    const role = document.getElementById('role').value;
    const estado = document.getElementById('estado')

    const url = baseUrl + "/registar"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: `email=${email}&name=${name}&password=${password}&role=${role}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json();
                throw new Error(erro.msg);
            }
            result = await response.json();
            estado.style.display = "block"
            estado.style.border = "#66BB6A solid"
            estado.style.backgroundColor = "#81C784"
            estado.innerHTML = result.message
        })
        .catch(async function (er) {
            console.log("entrei no catch")
            estado.style.display = "block"
            estado.style.border = "#C0392B solid"
            estado.style.backgroundColor = "#EC7063"
            estado.innerHTML = er;
        })
}

/*
function validarLogin() {
    console.log("Entrei para validar login") //para debug
    const email = document.getElementById('emailLogin').value
    const password = document.getElementById('passwordLogin').value
    const role = document.getElementById('role').value
    const estado = document.getElementById('estado')

    const url = baseUrl + "/login"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: `email=${email}&password=${password}&role=${role}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            console.log("login feito com sucesso, deve aparecer a pagina do perfil de utilizador")
        })
        .catch(async function (response) {
            estado.style.display = "block"
            estado.style.backgroundColor = "#fa191983"
            estado.innerHTML = er
        })
}*/