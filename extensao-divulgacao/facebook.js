console.log("✅ Projeto X Divulgação carregado no Facebook");


// ======================================
// VERIFICAR CONTEXTO DA EXTENSÃO
// ======================================

function extensaoEstaAtiva() {

    try {

        return Boolean(
            chrome &&
            chrome.runtime &&
            chrome.runtime.id &&
            chrome.storage &&
            chrome.storage.local
        );

    } catch {

        return false;

    }

}


// ======================================
// VERIFICAR BUSCA DE GRUPOS
// ======================================

function obterTermoBusca() {

    try {

        const url =
            new URL(
                window.location.href
            );

        const termo =
            url.searchParams.get("q") || "";

        return termo.trim();

    } catch {

        return "";

    }

}


function estaNaBuscaDeGrupos() {

    return (
        window.location.pathname
            .includes(
                "/search/groups"
            )
    );

}


// ======================================
// NORMALIZAR TEXTO
// ======================================

function normalizarTexto(
    texto = ""
) {

    return String(texto)
        .replace(/\s+/g, " ")
        .trim();

}


// ======================================
// DESCOBRIR O BLOCO DO RESULTADO
// ======================================

function obterBlocoDoGrupo(
    link
) {

    let elemento =
        link;


    /*
        O Facebook altera bastante o HTML.

        Por isso subimos alguns níveis
        procurando o bloco que contém:

        - nome do grupo
        - público / privado
        - membros
        - descrição
    */

    for (
        let nivel = 0;
        nivel < 8 && elemento;
        nivel++
    ) {

        const texto =
            normalizarTexto(
                elemento.innerText || ""
            );


        if (
            texto.length >= 10 &&
            texto.length <= 1800
        ) {

            const pareceResultado =
                /público|public group|grupo público|privado|private group|membros|members/i
                    .test(
                        texto
                    );


            if (
                pareceResultado
            ) {

                return elemento;

            }

        }


        elemento =
            elemento.parentElement;

    }


    return link.parentElement;

}


// ======================================
// VERIFICAR SE O GRUPO É PÚBLICO
// ======================================

function grupoEhPublico(
    link
) {

    const bloco =
        obterBlocoDoGrupo(
            link
        );


    if (!bloco) {

        return false;

    }


    const texto =
        normalizarTexto(
            bloco.innerText || ""
        )
            .toLowerCase();


    /*
        Português
    */

    if (
        texto.includes(
            "grupo público"
        )
    ) {

        return true;

    }


    /*
        Em algumas telas o Facebook
        mostra apenas "Público".
    */

    if (
        /(^|\s|·)público(\s|·|$)/i
            .test(
                texto
            )
    ) {

        return true;

    }


    /*
        Inglês, caso o Facebook
        apareça nesse idioma.
    */

    if (
        texto.includes(
            "public group"
        )
    ) {

        return true;

    }


    return false;

}


// ======================================
// NORMALIZAR URL DO GRUPO
// ======================================

function obterUrlGrupo(
    link
) {

    let url =
        link.href || "";


    if (!url) {

        return null;

    }


    try {

        const endereco =
            new URL(
                url
            );


        const partes =
            endereco.pathname
                .split("/")
                .filter(
                    Boolean
                );


        const indiceGroups =
            partes.indexOf(
                "groups"
            );


        if (
            indiceGroups === -1 ||
            !partes[
                indiceGroups + 1
            ]
        ) {

            return null;

        }


        const identificador =
            partes[
                indiceGroups + 1
            ];


        const ignorar = [

            "feed",
            "discover",
            "create",
            "joins",
            "notifications",
            "search",
            "groups"

        ];


        if (
            ignorar.includes(
                identificador
                    .toLowerCase()
            )
        ) {

            return null;

        }


        return (

            "https://www.facebook.com/groups/" +
            identificador

        );


    } catch {

        return null;

    }

}


// ======================================
// OBTER NOME DO GRUPO
// ======================================

function obterNomeGrupo(
    link
) {

    const nome =
        normalizarTexto(
            link.innerText || ""
        );


    if (!nome) {

        return null;

    }


    /*
        Ignora textos que claramente
        não parecem nome de grupo.
    */

    const nomesInvalidos = [

        "participar",
        "join",
        "ver grupo",
        "view group",
        "grupo",
        "groups"

    ];


    if (
        nomesInvalidos.includes(
            nome.toLowerCase()
        )
    ) {

        return null;

    }


    return nome;

}


// ======================================
// REMOVER BOTÃO ANTIGO
// ======================================

const botaoAntigo =
    document.getElementById(
        "projetox-capturar-grupos"
    );


if (botaoAntigo) {

    botaoAntigo.remove();

}


// ======================================
// CRIAR BOTÃO
// ======================================

const botao =
    document.createElement(
        "button"
    );


botao.id =
    "projetox-capturar-grupos";


botao.textContent =
    "🌐 Capturar grupos públicos";


botao.style.cssText = `

    position:fixed;

    right:20px;
    bottom:20px;

    z-index:99999999;

    background:#111827;

    color:#ffffff;

    border:none;

    border-radius:10px;

    padding:13px 17px;

    font-size:14px;

    font-weight:bold;

    cursor:pointer;

    box-shadow:
    0 8px 25px
    rgba(0,0,0,.35);

`;


document.body.appendChild(
    botao
);


// ======================================
// SALVAR GRUPOS
// ======================================

function salvarGruposCapturados(
    termo,
    grupos
) {

    if (
        !extensaoEstaAtiva()
    ) {

        alert(
            "⚠️ A extensão foi atualizada. Feche esta aba do Facebook e abra novamente."
        );

        return;

    }


    try {

        chrome.storage.local.set(
            {

                termoBuscaGrupos:
                    termo,

                gruposEncontrados:
                    grupos,

                filtroGrupos:
                    "publicos",

                dataCapturaGrupos:
                    new Date()
                        .toISOString()

            },
            () => {

                try {

                    if (
                        chrome.runtime
                            .lastError
                    ) {

                        console.warn(

                            "Projeto X:",

                            chrome.runtime
                                .lastError
                                .message

                        );

                        return;

                    }


                    alert(

                        `✅ ${grupos.length} grupo(s) público(s) encontrado(s) para "${termo}".`

                    );


                    console.log(

                        "🌐 Projeto X - grupos públicos:",

                        {
                            termo,
                            quantidade:
                                grupos.length,
                            grupos
                        }

                    );


                } catch {

                    console.warn(
                        "⚠️ Contexto da extensão foi atualizado."
                    );

                }

            }
        );


    } catch (erro) {

        console.warn(

            "⚠️ Não foi possível acessar a extensão:",

            erro

        );


        alert(
            "⚠️ A extensão foi atualizada. Feche esta aba do Facebook e abra uma nova."
        );

    }

}


// ======================================
// CAPTURAR SOMENTE GRUPOS PÚBLICOS
// ======================================

function capturarGruposFacebook() {

    if (
        !estaNaBuscaDeGrupos()
    ) {

        alert(
            "⚠️ Abra primeiro uma pesquisa de grupos pelo Projeto X."
        );

        return;

    }


    const termo =
        obterTermoBusca();


    const links =
        document.querySelectorAll(
            'a[href*="/groups/"]'
        );


    const grupos =
        [];


    let ignoradosPrivados =
        0;


    let ignoradosInvalidos =
        0;


    links.forEach(
        link => {


            const nome =
                obterNomeGrupo(
                    link
                );


            if (!nome) {

                ignoradosInvalidos++;

                return;

            }


            const url =
                obterUrlGrupo(
                    link
                );


            if (!url) {

                ignoradosInvalidos++;

                return;

            }


            /*
                FILTRO PRINCIPAL

                Se o resultado não for
                identificado como público,
                ele não entra na lista.
            */

            const publico =
                grupoEhPublico(
                    link
                );


            if (!publico) {

                ignoradosPrivados++;

                return;

            }


            const repetido =
                grupos.some(
                    grupo =>
                        grupo.url ===
                        url
                );


            if (repetido) {

                return;

            }


            grupos.push({

                nome,

                url,

                tipo:
                    "publico"

            });


        }
    );


    console.log(

        "🔎 Projeto X - filtro da busca:",

        {

            termo,

            linksAnalisados:
                links.length,

            publicosEncontrados:
                grupos.length,

            naoPublicosIgnorados:
                ignoradosPrivados,

            linksInvalidos:
                ignoradosInvalidos

        }

    );


    salvarGruposCapturados(
        termo,
        grupos
    );

}


// ======================================
// CLIQUE NO BOTÃO
// ======================================

botao.addEventListener(
    "click",
    capturarGruposFacebook
);
