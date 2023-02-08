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

function validarFormUser() {
    console.log("vim validar o form do user")
}

function validarFormEmpresa() {
    console.log("vim validar o form da empresa")
}

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
    </div>`
}

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
    </div>`
}