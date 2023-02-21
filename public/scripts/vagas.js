var init = function () {
    let vagasArr = [];
    let feedArr = [];
    var ordenar = new Map();
    const urlBase = "http://localhost:8888";

    var btnLimparFiltro = document.getElementById('btnLimparFiltro');
    var btnFiltrar = document.getElementById('btnFiltrar');
    var listaVagas = document.querySelector('.listaVagas');
    var filterElements = document.getElementById('filter');
    var ordenarElements = document.getElementById('ordenar');

    var removerDaDOM = function () {
        let arr = [];
        while (listaVagas.firstElementChild) {
            if (listaVagas.nodeType === Node.ELEMENT_NODE) {
                arr.push(listaVagas.children[0]);
            }
            listaVagas.removeChild(listaVagas.children[0]);
        }
        return arr;
    }

    btnLimparFiltro.addEventListener("click", function () {
        let filtro = document.getElementById("filter");
        let ordenar = document.getElementById("ordenar");
        filtro.selectedIndex = 0;
        ordenar.selectedIndex = 0;

        if (feedArr.length !== 0) {
            removerDaDOM();

            for (let i = 0; i < feedArr.length; i++) {
                listaVagas.appendChild(feedArr[i]);
            }
        }
    });

    //mudar a função para um file na pasta models e usar pug, usar fetch aqui para "chamar o caminho" para a função
    var publicar = function (vagas) {
        removerDaDOM();

        for (let [key, value] of vagas) {
            var divVaga = document.createElement('div');
            divVaga.className = "vaga";

            var nome = value.children[0].textContent;
            var descricao = value.children[2].textContent;
            var area = value.children[4].textContent;
            var duracao = value.children[6].textContent;
            var valor = value.children[8].textContent;
            var validade = value.children[11].textContent;

            divVaga.innerHTML = `<h3>${nome}</h3>
                                 <hr>
                                 <p> ${descricao}</p>
                                 <hr>
                                 <p>${area}</p>
                                 <hr>
                                 <p>${duracao}</p>
                                 <hr>
                                 <p>${valor}</p>
                                 <hr>
                                 <p>Oferta válida até</p>
                                 <p>${validade}</p>
                                 <form action="">
                                    <input class="candidateBtn" type="submit" value="Candidatar-se" />
                                 </form>`

            listaVagas.appendChild(divVaga);
        }
    }

    btnFiltrar.addEventListener("click", function () {
        let filterselectedIndex = filterElements.selectedIndex;
        let ordenarselectedIndex = ordenarElements.selectedIndex;

        if ((filterselectedIndex !== 0 || ordenarselectedIndex !== 0) && vagasArr.length === 0) {
            vagasArr = removerDaDOM();
            for (let i = 0; i < vagasArr.length; i++) {
                feedArr.push(vagasArr[i]);
            }
        } else if (filterselectedIndex !== 0 && ordenarselectedIndex !== 0) {
            vagasArr = removerDaDOM();
        }


        switch (filterselectedIndex) {
            case 1: //Duração
                ordenar.clear();
                for (let i = 0; i < vagasArr.length; i++) {
                    let duration = vagasArr[i].children[6].textContent.split(' ')[0];
                    if (duration !== '') {
                        ordenar.set(i, vagasArr[i]);
                    }
                }
                publicar(ordenar);
                break;

            case 2: //Área
                ordenar.clear();
                for (let i = 0; i < vagasArr.length; i++) {
                    let area = vagasArr[i].children[4].textContent;
                    if (area !== '') {
                        ordenar.set(i, vagasArr[i]);
                    }
                }
                publicar(ordenar);
                break;

            case 3: //Duração e Área
                ordenar.clear();
                for (let i = 0; i < vagasArr.length; i++) {
                    let area = vagasArr[i].children[4].textContent;
                    let duration = vagasArr[i].children[6].textContent.split(' ')[0];
                    if (area !== '' && duration !== '') {
                        ordenar.set(i, vagasArr[i]);
                    }
                }
                publicar(ordenar);
                break;

            default:
                break;
        }


        switch (ordenarselectedIndex) {
            case 1: //valor (crescente)
                ordenar.clear();
                for (let i = 0; i < vagasArr.length; i++) {
                    let value = vagasArr[i].children[8].textContent.split('€')[0];
                    ordenar.set(value, vagasArr[i]);
                }
                ordenar = new Map([...ordenar.entries()].sort((a, b) => a[0] - b[0]));
                publicar(ordenar);
                break;

            case 2: //valor (decrescente)
                ordenar.clear();
                for (let i = 0; i < vagasArr.length; i++) {
                    let value = vagasArr[i].children[8].textContent.split('€')[0];
                    ordenar.set(value, vagasArr[i]);
                }
                ordenar = new Map([...ordenar.entries()].sort((a, b) => b[0] - a[0]));
                publicar(ordenar);
                break;

            case 3: //validade (crescente)
                ordenar.clear();
                for (let i = 0; i < vagasArr.length; i++) {
                    let value = new Date(vagasArr[i].children[11].textContent);
                    ordenar.set(value, vagasArr[i]);
                }
                ordenar = new Map([...ordenar.entries()].sort((a, b) => a[0] - b[0]));

                publicar(ordenar);
                break;

            case 4: //validade (decrescente)
                ordenar.clear();
                for (let i = 0; i < vagasArr.length; i++) {
                    let value = new Date(vagasArr[i].children[11].textContent);
                    ordenar.set(value, vagasArr[i]);
                }
                ordenar = new Map([...ordenar.entries()].sort((a, b) => b[0] - a[0]));
                publicar(ordenar);
                break;

            default:
                break;
        }
    })
}

window.onload = init;