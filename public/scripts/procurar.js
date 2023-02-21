const baseUrl = "http://127.0.0.01:8888";

/**
 * Mostra todos os profissionais
 */
function getAllUsers() {
    const UsersList = document.getElementById('UsersCompaniesList')
    const url = baseUrl + "/procurarUsers"

    fetch(url, {
        method: "POST"
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            UsersList.innerHTML = ""

            for (let i = 0; i < Object.keys(result.data).length; i++) {
                var profissional = document.createElement('div');
                profissional.setAttribute("id", `profissional`);
                profissional.className = "user"
                if (result.data[i].email == result.email) {
                    profissional.innerHTML = `<h3>${result.data[i].name}</h3>`
                } else {
                    profissional.innerHTML = `<h3>${result.data[i].name}</h3>
                                              <button id="btnAddFriend" class="btnAdicionarAmigo" title="Adicionar amigo" onclick="addFriend('${result.data[i].email}')">Add</button>`
                }
                UsersList.appendChild(profissional);
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

/**
 * Mostra todas as empresas
 */
function getAllCompanies() {
    const UsersList = document.getElementById('UsersCompaniesList')
    const url = baseUrl + "/procurarEmpresas"

    fetch(url, {
        method: "POST"
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            UsersList.innerHTML = ""

            for (let i = 0; i < Object.keys(result).length; i++) {
                var profissional = document.createElement('div');
                profissional.setAttribute("id", `profissional`);
                profissional.setAttribute("data-email", `${result[i].email}`);
                profissional.className = "user"
                profissional.innerHTML = `<h3>${result[i].name}</h3>`
                //<button id="btnAddFriend" class="btnAdicionarAmigo" title="Adicionar amigo" onclick="addFriend('${result[i].email}', this)">Add</button>`
                UsersList.appendChild(profissional);
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

/**
 * Permite fazer um pedido de amizade
 * @param {*} userID 
 */
function addFriend(userID) {
    const url = baseUrl + "/addFriend"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: `email=${userID}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
        })
        .catch(async function (er) {
            console.log(er)
        })
}


window.onload = getAllUsers;