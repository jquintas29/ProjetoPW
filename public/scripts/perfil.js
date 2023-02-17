const baseUrl = "http://127.0.0.01:8888";

function formPerfil() {
    console.log("form do perfil a caminho")
    const url = baseUrl + "/api/session";

    fetch(url)
        .then(async function (response) {
            res = await response.json()
            console.log(res.user)
            if (res.user.role == "user") {
                perfilUser();
            } else if (res.user.role == "company") {
                perfilCompany();
            }
        })
}

function cancelarPerfilForm() {
    const formDescrição = document.getElementById("formDescrição");

    formDescrição.innerHTML = ""
}

function validarFormUser() {
    console.log("vim validar o form do user")
    const name = document.getElementById('perfilNome').value
    const birth = document.getElementById('dataNascimento').value
    const genero = document.getElementById('perfilGenero').value
    const descricao = document.getElementById('descricaoPerfil').value
    const localidade = document.getElementById('perfilLocalidade').value
    const vistoPorEmpresas = document.getElementById('vistoPorEmpresas').value

    console.log("birth: " + birth);

    const url = baseUrl + "/alterUser"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        body: `name=${name}&data_nascimento=${birth}&genero=${genero}&descricao=${descricao}&localidade=${localidade}&visto_por_empresa=${vistoPorEmpresas}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();

            console.log("result: " + JSON.stringify(result))
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function validarFormEmpresa() {
    console.log("vim validar o form da empresa")
    const name = document.getElementById('perfilNome').value
    const descricao = document.getElementById('descricaoPerfil').value
    const URLEmpresa = document.getElementById('perfilUrl').value
    const URLLogo = document.getElementById('perfilUrlLogo').value

    const url = baseUrl + "/alterCompany"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        body: `name=${name}&descricao=${descricao}&URLEmpresa=${URLEmpresa}&URLLogo=${URLLogo}`
    }).then(async function (response) {
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

//Função para mostrar o formulário do utilizador
function perfilUser() {
    console.log("form da descrição do profissional")
    const formDescrição = document.getElementById("formDescrição");

    formDescrição.innerHTML = `<div class="myForm" id="perfilForm">
        <label for="perfilNome">Nome</label>
        <input type="text" name="perfilNome" id="perfilNome" class="myFormElem" placeholder="Nome" required>

        <label for="dataNascimento">Data de Nascimento</label>
            <input type="date" name="dataNascimento" id="dataNascimento" class="myFormElem" placeholder="" required>

        <label for="perfilGenero">Genero</label>
        <input type="text" name="perfilGenero" id="perfilGenero" class="myFormElem" placeholder="Genero"
            required>

        <label for="descricaoPerfil">Descrição</label>
        <textarea name="descricaoPerfil" id="descricaoPerfil" class="myFormElem" cols="30" rows="10"
            placeholder="Introduza a sua descrição"></textarea>

        <label for="perfilLocalidade">Localidade</label>
        <input type="text" name="perfilLocalidade" id="perfilLocalidade" class="myFormElem"
            placeholder="Localidade" required>

        <div>
            <label for="vistoPorEmpresas">Visto pelas empresas</label>
            <select id="vistoPorEmpresas" class="myFormElem" name="vistoPorEmpresas" required>
                <option value="1" selected>Sim</option>
                <option value="0">Não</option>
            </select>
        </div>

        <button id="btnGuardar" class="Btn" onclick="validarFormUser()">Guardar</button>
        <button id="btnCancelar" class="Btn" onclick="cancelarPerfilForm()">Cancelar</button>
    </div>`
}

//Função para mostrar o formulário da empresa
function perfilCompany() {
    console.log("form da descrição da empresa")
    const formDescrição = document.getElementById("formDescrição");

    formDescrição.innerHTML = `<div class="myForm" id="perfilForm">
        <label for="perfilNome">Nome</label>
        <input type="text" name="perfilNome" id="perfilNome" class="myFormElem" placeholder="Nome" required>

        <label for="descricaoPerfil">Descrição</label>
        <textarea name="descricaoPerfil" id="descricaoPerfil" class="myFormElem" cols="30" rows="10"
            placeholder="Introduza a sua descrição"></textarea>

        <label for="perfilUrl">Site da empresa</label>
        <input type="text" name="perfilUrl" id="perfilUrl" class="myFormElem" placeholder="URL do site" required>
    
        <label for="perfilUrlLogo">Logo da empresa</label>
        <input type="text" name="perfilUrlLogo" id="perfilUrlLogo" class="myFormElem" placeholder="URL do logo" required>

        <button id="btnGuardar" class="Btn" onclick="validarFormEmpresa()">Guardar</button>
        <button id="btnCancelar" class="Btn" onclick="cancelarPerfilForm()">Cancelar</button>
    </div>`
}