function alterarPerfil() {
    console.log("estou a alterar o perfil")
    const perfil = document.querySelector(".perfil");

    const xhttp = new XMLHttpRequest()

    xhttp.onload = function () {
        console.log("vou imprimir o form do perfil");
        console.log(this.responseText)
        if (this.responseText.role == 'user') {
            console.log("entrei");
            perfil.appendChild = `<form class="myForm" id="perfilForm" name="myForm" action="">
                                <label for="perfilNome">Nome</label>
                                <input type="text" name="perfilNome" id="perfilNome" class="myFormElem" placeholder="Nome" required>

                                <label for="dataNascimento">Data de Nascimento</label>
                                <input type="date" name="dataNascimento" id="dataNascimento" class="myFormElem" placeholder=""
                                    required>

                                <label for="perfilGenero">Genero</label>
                                <input type="text" name="perfilGenero" id="perfilGenero" class="myFormElem" placeholder="Genero"
                                    required>

                                <label for="descricaoPerfil">Descrição</label>
                                <textarea name="descricaoPerfil" id="descricaoPerfil" class="myFormElem" cols="30" rows="10"
                                    placeholder="Introduza a sua descrição"></textarea>

                                <label for="perfilLocalidade">Genero</label>
                                <input type="text" name="perfilLocalidade" id="perfilLocalidade" class="myFormElem"
                                    placeholder="Localidade" required>

                                <div>
                                    <label for="checkSeen">Visto pelas empresas</label>
                                    <select id="beSeen" class="myFormElem" name="beSeen" required>
                                        <option value="1" selected>Sim</option>
                                        <option value="0">Não</option>
                                    </select>
                                </div>

                                <input id="btnGuardar" class="Btn" name="btnGuardar" type="submit" value="Guardar" />
                            </form>`
        }
    }
    xhttp.open("GET", '/perfil/change')
    //xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send()
}