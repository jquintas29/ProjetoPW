
const baseUrl = "http://127.0.0.01:8888";

function showUsersToAdmin() {
    const listaAmigos = document.getElementById('listaAmigos');
    const descricao = document.getElementById('descrição')
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
            console.log(result.data)
            descricao.style.display = "none";
            listaAmigos.innerHTML = ""

            for (let i = 0; i < Object.keys(result.data).length; i++) {
                var profissional = document.createElement('div');
                profissional.setAttribute("id", `profissional`);
                profissional.className = "user"
                profissional.innerHTML = `<h3>${result.data[i].name}</h3>
                                          <button id="btnAddFriend" class="btnAdmin" title="Remover" onclick="removerProfissional('${result.data[i].email}', this)">Remover</button>`
                listaAmigos.appendChild(profissional);
            }
        })
        .catch(async function (er) {
            console.log(er)
            listaAmigos.innerHTML = ""
            showMessage("No professionals registed!")
        })
}

function showCompaniesToAdmin() {
    const listaAmigos = document.getElementById('listaAmigos');
    const descricao = document.getElementById('descrição')
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
            descricao.style.display = "none";
            listaAmigos.innerHTML = ""

            if (Object.keys(result).length == 0) {
                showMessage("No companies registed!")
            } else {
                for (let i = 0; i < Object.keys(result).length; i++) {
                    var empresa = document.createElement('div');
                    empresa.setAttribute("id", `empresa`);
                    empresa.className = "user"
                    empresa.innerHTML = `<h3>${result[i].name}</h3>
                                          <button id="btnAddFriend" class="btnAdmin" title="Remover" onclick="removerEmpresa('${result[i].email}', this)">Remover</button>`
                    listaAmigos.appendChild(empresa);
                }
            }
        })
        .catch(async function (er) {
            console.log(er)
            listaAmigos.innerHTML = ""
            showMessage("No companies registed!")
        })
}

function showCompaniesToAdminWReq() {
    const listaAmigos = document.getElementById('listaAmigos');
    const descricao = document.getElementById('descrição')
    const url = baseUrl + "/procurarEmpresasComRequest"

    fetch(url, {
        method: "POST"
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            descricao.style.display = "none";
            listaAmigos.innerHTML = ""

            if (Object.keys(result).length == 0) {
                showMessage("No companies requests registed!")
            } else {
                for (let i = 0; i < Object.keys(result).length; i++) {
                    var empresa = document.createElement('div');
                    empresa.setAttribute("id", `empresa`);
                    empresa.className = "user"
                    empresa.innerHTML = `<h3>${result[i].name}</h3>
                                     <button id="btnAddFriend" class="btnAdmin" title="Aceitar" onclick="AceitarEmpresa('${result[i].email}', this)">Aceitar</button>
                                     <button id="btnAddFriend" class="btnAdmin" title="Remover" onclick="removerEmpresa('${result[i].email}', this)">Remover</button>`
                    listaAmigos.appendChild(empresa);
                }
            }
        })
        .catch(async function (er) {
            console.log(er)
            listaAmigos.innerHTML = ""
            showMessage("No company requests registed!")
        })
}

function AceitarEmpresa(email, botao) {
    const listaAmigos = document.getElementById('listaAmigos');
    const profissional = botao.parentNode;
    const url = baseUrl + "/aceitarEmpresa"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        body: `email=${email}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            listaAmigos.removeChild(profissional)
            if (listaAmigos.children.length == 0) {
                showMessage("No Companies registed!")
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function removerEmpresa(email, botao) {
    const listaAmigos = document.getElementById('listaAmigos');
    const profissional = botao.parentNode;
    const url = baseUrl + "/removerEmpresa"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "DELETE",
        body: `email=${email}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            listaAmigos.removeChild(profissional)
            if (listaAmigos.children.length == 0) {
                showMessage("No Companies registed!")
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function removerProfissional(email, botao) {
    const listaAmigos = document.getElementById('listaAmigos');
    const profissional = botao.parentNode;
    const url = baseUrl + "/removerProfissional"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "DELETE",
        body: `email=${email}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            listaAmigos.removeChild(profissional)
            if (listaAmigos.children.length == 0) {
                showMessage("No professionals registed!")
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function formDescrição() {
    const descricao = document.getElementById('descrição');
    const url = baseUrl + "/api/session";

    fetch(url)
        .then(async function (response) {
            res = await response.json()
            if (res.user.role == "user") {
                descricao.style.display = "none";
                perfilUser();
            } else if (res.user.role == "company") {
                descricao.style.display = "none";
                perfilCompany();
            }
        })
}

function reloadPerfilPage() {
    location.reload();
}

function getUserFriends() {
    const listaAmigos = document.getElementById('listaAmigos');
    const descricao = document.getElementById('descrição');
    const url = baseUrl + "/userFriends"

    fetch(url, {
        method: "POST"
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            descricao.style.display = "none";
            listaAmigos.innerHTML = ""

            //para verificar o tamanho do array recebido da base de dados usar: Object.keys(result).length
            for (let i = 0; i < Object.keys(result).length; i++) {
                var amigo = document.createElement('div');
                amigo.setAttribute("id", `${result[i].id}`);
                amigo.className = "amigo"
                amigo.innerHTML = `<h3>${result[i].nome}</h3>
                                   <button id="btnRemoveFriend" class="btnActionAmigo" title="Remover amigo" onclick="removerAmigo('${result[i].id}')">X</button>`
                listaAmigos.appendChild(amigo);
            }
        })
        .catch(async function (er) {
            console.log(er)
            listaAmigos.innerHTML = ""
            showMessage("No friends added!")
        })
}

function getFriendsRequests() {
    const listaAmigos = document.getElementById('listaAmigos');
    const descricao = document.getElementById('descrição');
    const url = baseUrl + "/userFriendsRequests"

    fetch(url, {
        method: "POST"
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            descricao.style.display = "none";
            listaAmigos.innerHTML = ""

            //para verificar o tamanho do array recebido da base de dados usar: Object.keys(result).length
            for (let i = 0; i < Object.keys(result).length; i++) {
                var amigo = document.createElement('div');
                amigo.setAttribute("id", `${result[i].id}`);
                amigo.className = "amigo"
                amigo.innerHTML = `<h3>${result[i].nome_user}</h3>
                                   <button id="btnAceitarFriend" class="btnActionAmigo" title="Aceitar amigo" onclick="aceitarAmigo('${result[i].id}', '${result[i].users_email}')">Aceitar</button>
                                   <button id="btnRemoveFriend" class="btnActionAmigo" title="Remover amigo" onclick="removerAmigo('${result[i].id}')">X</button>`
                listaAmigos.appendChild(amigo);
            }
        })
        .catch(async function (er) {
            console.log(er)
            listaAmigos.innerHTML = ""
            showMessage("No friend requests!")
        })
}

function showMessage(msg) {
    const descricao = document.getElementById('descrição');
    descricao.style.display = "none";
    var message = document.createElement('div');
    message.setAttribute("id", `0`);
    message.className = "message"
    message.innerHTML = msg
    //listaAmigos.appendChild(message);
    listaAmigos.prepend(message);
}

function aceitarAmigo(friendId, email) {
    const listaAmigos = document.getElementById('listaAmigos');
    const amigo = document.getElementById(friendId);
    const url = baseUrl + "/aceitarPedido"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        body: `id=${friendId}&email=${email}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            listaAmigos.removeChild(amigo)
            if (listaAmigos.children.length == 0) {
                showMessage("No friend requests!")
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function removerAmigo(friendId) {
    const listaAmigos = document.getElementById('listaAmigos');
    const amigo = document.getElementById(friendId);
    const url = baseUrl + "/removerAmigo"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "DELETE",
        body: `id=${friendId}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            listaAmigos.removeChild(amigo)
            if (listaAmigos.children.length == 0) {
                showMessage("No friends added!")
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function validarFormUser() {
    const name = document.getElementById('perfilNome').value
    const birth = document.getElementById('dataNascimento').value
    const genero = document.getElementById('perfilGenero').value
    const descricao = document.getElementById('descricaoPerfil').value
    const localidade = document.getElementById('perfilLocalidade').value
    const vistoPorEmpresas = document.getElementById('vistoPorEmpresas').value
    const url = baseUrl + "/alterUser"

    console.log("visto por empresas: " + vistoPorEmpresas)

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
            location.reload();
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function validarFormEmpresa() {
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
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            location.reload();
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function getWorkExperience() {
    const listaAmigos = document.getElementById('listaAmigos');
    const descricao = document.getElementById('descrição');
    const url = baseUrl + "/userWorkExperience"

    fetch(url, {
        method: "POST"
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            descricao.style.display = "none";
            listaAmigos.innerHTML = ""


            //para verificar o tamanho do array recebido da base de dados usar: Object.keys(result).length
            for (let i = 0; i < Object.keys(result).length; i++) {
                var trabalho = document.createElement('div')

                let inicio, fim
                if (result[i].data_inicio != null) {
                    inicio = new Date(result[i].data_inicio)
                    inicio = `${inicio.getDate()}/${inicio.getMonth() + 1}/${inicio.getFullYear()}`
                } else {
                    inicio = ""
                }
                if (result[i].data_fim != null) {
                    fim = new Date(result[i].data_fim)
                    fim = `${fim.getDate()}/${fim.getMonth() + 1}/${fim.getFullYear()}`
                } else {
                    fim = ""
                }

                trabalho.setAttribute("id", `${result[i].id}`);
                trabalho.className = "trabalho"
                trabalho.innerHTML = `<h2>Nome</h2>
                                      <p>${result[i].name}</p>
                                      <h2>Link do Local onde trabalhou</h2>
                                      <a href="${result[i].url}">
                                      website ${result[i].name}</a>
                                      <h2>Começou a:</h2>
                                      <p>${inicio}</p>
                                      <h2>Acabou a:</h2>
                                      <p>${fim}</p>
                                      <h2>Descrição</h2>
                                      <p>${result[i].descricao}</p>
                                      <button id="btnAddWorkExperience" class="Btn" title="Adicionar trabalho" onclick="removerWork(${result[i].id})">Remove</button>
                                      <button id="btnAddWorkExperience" class="Btn" title="Adicionar trabalho" 
                                      onclick="editWorkExperience('${result[i].id}', '${result[i].name}', '${result[i].url}', '${inicio}', '${fim}', '${result[i].descricao}')">Edit</button>`
                listaAmigos.append(trabalho)
            }
            var buttonDiv = document.createElement('div')
            buttonDiv.setAttribute("id", "addWorkExperience")
            buttonDiv.className = "addTrabalho"
            buttonDiv.innerHTML = `<button id="btnAddWorkExperience" class="Btn" title="Adicionar trabalho" onclick="addWorkExperience()"> + Add Work Experience</button>`
            listaAmigos.appendChild(buttonDiv)
        })
        .catch(async function (er) {
            console.log(er)
            listaAmigos.innerHTML = ""
            showMessage("No work experience added!")
            var buttonDiv = document.createElement('div')
            buttonDiv.setAttribute("id", "addWorkExperience")
            buttonDiv.className = "addTrabalho"
            buttonDiv.innerHTML = `<button id="btnAddWorkExperience" class="Btn" title="Adicionar trabalho" onclick="addWorkExperience()"> + Add Work Experience</button>`
            listaAmigos.appendChild(buttonDiv)
        })
}

function removerWork(workId) {
    const listaAmigos = document.getElementById('listaAmigos');
    const work = document.getElementById(workId);
    const url = baseUrl + "/removerTrabalho"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "DELETE",
        body: `id=${workId}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            listaAmigos.removeChild(work)
            if (listaAmigos.children.length == 1) {
                showMessage("No work experience added!")
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function addWorkExperience() {
    const formDescrição = document.getElementById("formDescrição");
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = ""

    formDescrição.innerHTML = `<form class="myForm" id="perfilForm" onsubmit="validarFormWork('addWork', '')">
                                <label for="localname">Local Name</label>
                                <input type="text" name="localname" id="localname" class="myFormElem" placeholder="Local Name" required>

                                <label for="logourl">Logo Url</label>
                                    <input type="url" name="logourl" id="logourl" class="myFormElem" placeholder="Logo Url" required>

                                <label for="startdate">Start Date</label>
                                <input type="date" name="startdate" id="startdate" class="myFormElem" placeholder="Start Date" required>

                                <label for="enddate">End Date</label>
                                <input type="date" name="enddate" id="enddate" class="myFormElem" placeholder="End Date" required>

                                <label for="jobdescription">Job Description</label>
                                <textarea name="jobdescription" id="jobdescription" class="myFormElem" cols="30" rows="10" required
                                placeholder="Introduza a descrição do trabalho"></textarea>

                                <input type="submit" id="btnGuardar" class="Btn" value="Guardar">
                                <button id="btnCancelar" class="Btn" onclick="reloadPerfilPage()">Cancelar</button>
                            </form>`
}

function editWorkExperience(id, name, url, inicio, fim, descricao) {
    const formDescrição = document.getElementById("formDescrição");
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = ""
    console.log("descricao" + descricao)
    formDescrição.innerHTML = `<form class="myForm" id="perfilForm" onsubmit="validarFormWork('editWork', '${id}')">
                                <label for="localname">Local Name</label>
                                <input type="text" name="localname" id="localname" class="myFormElem" placeholder="Local Name" value="${name}" >

                                <label for="logourl">Logo Url</label>
                                <input type="url" name="logourl" id="logourl" class="myFormElem" placeholder="Logo Url" value="${url}" >

                                <label for="startdate">Start Date</label>
                                <input type="date" name="startdate" id="startdate" class="myFormElem" placeholder="Start Date" value="${inicio}" >

                                <label for="enddate">End Date</label>
                                <input type="date" name="enddate" id="enddate" class="myFormElem" placeholder="End Date" value="${fim}" >

                                <label for="jobdescription">Job Description</label>
                                <textarea name="jobdescription" id="jobdescription" class="myFormElem" cols="30" rows="10"  
                                placeholder="Introduza a descrição do trabalho">${descricao}</textarea>

                                <input type="submit" id="btnGuardar" class="Btn" value="Guardar">
                                <button id="btnCancelar" class="Btn" onclick="reloadPerfilPage()">Cancelar</button>
                            </form>`
}

function validarFormWork(route, id) {
    const localname = document.getElementById('localname').value
    const logourl = document.getElementById('logourl').value
    const startdate = document.getElementById('startdate').value
    const enddate = document.getElementById('enddate').value
    const jobdescription = document.getElementById('jobdescription').value
    const url = baseUrl + "/" + route

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: `id=${id}&localname=${localname}&logourl=${logourl}&startdate=${startdate}&enddate=${enddate}&jobdescription=${jobdescription}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            location.reload();
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function getAcademicFormation() {
    const listaAmigos = document.getElementById('listaAmigos');
    const descricao = document.getElementById('descrição');
    const url = baseUrl + "/userAcademicFormation"

    fetch(url, {
        method: "POST"
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            descricao.style.display = "none";
            listaAmigos.innerHTML = ""

            //para verificar o tamanho do array recebido da base de dados usar: Object.keys(result).length
            for (let i = 0; i < Object.keys(result).length; i++) {
                var trabalho = document.createElement('div')
                trabalho.setAttribute("id", `${result[i].id}`);
                trabalho.className = "trabalho"
                trabalho.innerHTML = `<h2>Estabelecimento</h2>
                                      <p>${result[i].estabelecimento}</p>
                                      <h2>Curso</h2>
                                      <p>${result[i].curso}</p>
                                      <h2>Tipo de curso</h2>
                                      <p>${result[i].tipo_curso}</p>
                                      <h2>Média</h2>
                                      <p>${result[i].media}</p>
                                      <button id="btnAddWorkExperience" class="Btn" title="Adicionar trabalho" onclick="removerFormation(${result[i].id})">Remove</button>
                                      <button id="btnAddWorkExperience" class="Btn" title="Adicionar trabalho" onclick="editFormation('${result[i].id}', '${result[i].estabelecimento}', '${result[i].curso}', '${result[i].tipo_curso}', '${result[i].media}')">Edit</button>`
                listaAmigos.append(trabalho)
            }
            var buttonDiv = document.createElement('div')
            buttonDiv.setAttribute("id", "addAcademicFormation")
            buttonDiv.className = "addFormation"
            buttonDiv.innerHTML = `<button id="addAcademicFormation" class="Btn" title="Adicionar trabalho" onclick="addAcademicFormation()"> + Add Work Experience</button>`
            listaAmigos.appendChild(buttonDiv)
        })
        .catch(async function (er) {
            console.log(er)
            listaAmigos.innerHTML = ""
            showMessage("No Academic formation added!")
            var buttonDiv = document.createElement('div')
            buttonDiv.setAttribute("id", "addWorkExperience")
            buttonDiv.className = "addFormation"
            buttonDiv.innerHTML = `<button id="addAcademicFormation" class="Btn" title="Adicionar trabalho" onclick="addAcademicFormation()"> + Add Academic Formation</button>`
            listaAmigos.appendChild(buttonDiv)
        })
}

function removerFormation(formationID) {
    const listaAmigos = document.getElementById('listaAmigos');
    const formation = document.getElementById(formationID);
    const url = baseUrl + "/removerFormacao"

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "DELETE",
        body: `id=${formationID}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            listaAmigos.removeChild(formation)
            if (listaAmigos.children.length == 1) {
                showMessage("No formation added!")
            }
        })
        .catch(async function (er) {
            console.log(er)
        })
}

function editFormation(formationID, estabelecimento, curso, tipo_curso, media) {
    const formDescrição = document.getElementById("formDescrição");
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = ""

    formDescrição.innerHTML = `<form class="myForm" id="perfilForm" onsubmit="validarFormFormation('editFormation', '${formationID}')">
                                <label for="establishment">Establishment Name</label>
                                <input type="text" name="establishment" id="establishment" class="myFormElem" placeholder="Establishment Name" value="${estabelecimento}" >

                                <label for="coursename">Course Name</label>
                                <input type="text" name="coursename" id="coursename" class="myFormElem" placeholder="Course Name" value="${curso}" >

                                <label for="coursetype">Course Type</label>
                                <select id="coursetype" class="myFormElem" name="coursetype" >
                                    <option value="${tipo_curso}">Não alterar</option>
                                    <option value="">Não selecionar nenhuma opção</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Mestrado">Mestrado</option>
                                    <option value="Pós Graduação">Pós Graduação</option>
                                    <option value="Formação">Formação</option>
                                    <option value="CTeSP">CTeSP</option>
                                </select>

                                <label for="courseaverage">Course Average</label>
                                <input type="number" max="20" min="10" name="courseaverage" id="courseaverage" class="myFormElem" placeholder="Média" value="${media}" >

                                <input type="submit" id="btnGuardar" class="Btn" value="Guardar">
                                <button id="btnCancelar" class="Btn" onclick="cancelarPerfilForm()">Cancelar</button>
                            </form>`
}

function addAcademicFormation() {
    const formDescrição = document.getElementById("formDescrição");
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = ""

    formDescrição.innerHTML = `<form class="myForm" id="perfilForm" onsubmit="validarFormFormation('addFormation', '')">
                                <label for="establishment">Establishment Name</label>
                                <input type="text" name="establishment" id="establishment" class="myFormElem" placeholder="Establishment Name" required>

                                <label for="coursename">Course Name</label>
                                <input type="text" name="coursename" id="coursename" class="myFormElem" placeholder="Course Name" required>

                                <label for="coursetype">Course Type</label>
                                <select id="coursetype" class="myFormElem" name="coursetype" required>
                                    <option value="">Selecionar opção</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Mestrado">Mestrado</option>
                                    <option value="Pós Graduação">Pós Graduação</option>
                                    <option value="Formação">Formação</option>
                                    <option value="CTeSP">CTeSP</option>
                                </select>

                                <label for="courseaverage">Course Average</label>
                                <input type="number" max="20" min="10" name="courseaverage" id="courseaverage" class="myFormElem" placeholder="Média" required>

                                <input type="submit" id="btnGuardar" class="Btn" value="Guardar">
                                <button id="btnCancelar" class="Btn" onclick="reloadPerfilPage()">Cancelar</button>
                            </form>`
}

function validarFormFormation(route, id) {
    const establishmentName = document.getElementById('establishment').value
    const coursename = document.getElementById('coursename').value
    const coursetype = document.getElementById('coursetype').value
    const courseaverage = document.getElementById('courseaverage').value
    const url = baseUrl + "/" + route

    fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: `id=${id}&establishmentName=${establishmentName}&coursename=${coursename}&coursetype=${coursetype}&courseaverage=${courseaverage}`
    })
        .then(async function (response) {
            if (!response.ok) {
                erro = await response.json()
                throw new Error(erro.msg)
            }
            result = await response.json();
            //location.reload();
        })
        .catch(async function (er) {
            console.log(er)
        })
}

//Função para mostrar o formulário do utilizador
function perfilUser() {
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
        <button id="btnCancelar" class="Btn" onclick="reloadPerfilPage()">Cancelar</button>
    </div>`
}

//Função para mostrar o formulário da empresa
function perfilCompany() {
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
        <button id="btnCancelar" class="Btn" onclick="reloadPerfilPage()">Cancelar</button>
    </div>`
}