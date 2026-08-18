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
// VERIFICAR SE ESTÁ NA BUSCA DE GRUPOS
// ======================================

function obterTermoBusca() {

    const url =
        new URL(window.location.href);

    const termo =
        url.searchParams.get("q") || "";

    return termo.trim();
}


function estaNaBuscaDeGrupos() {

    return (
        window.location.pathname.includes(
            "/search/groups"
        )
    );
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
// CRIAR BOTÃO NOVO
// ======================================

const botao =
    document.createElement("button");

botao.id =
    "projetox-capturar-grupos";

botao.textContent =
    "🔎 Capturar grupos desta busca";

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
    box-shadow:0 8px 25px rgba(0,0,0,.35);
`;

document.body.appendChild(botao);


// ======================================
// SALVAR GRUPOS NA EXTENSÃO
// ======================================

function salvarGruposCapturados(
    termo,
    grupos
) {

    if (!extensaoEstaAtiva()) {

        alert(
            "⚠️ A extensão foi atualizada. Feche esta aba do Facebook e abra novamente."
        );

        return;
    }


    try {

        chrome.storage.local.set(
            {
                termoBuscaGrupos: termo,

                gruposEncontrados:
                    grupos,

                dataCapturaGrupos:
                    new Date().toISOString()
            },
            () => {

                try {

                    if (
                        chrome.runtime.lastError
                    ) {

                        console.warn(
                            "Projeto X:",
                            chrome.runtime.lastError.message
                        );

                        return;
                    }


                    alert(
                        `✅ ${grupos.length} grupo(s) encontrados para "${termo}".`
                    );


                    console.log(
                        "👥 Projeto X - resultados:",
                        {
                            termo,
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
// CAPTURAR RESULTADOS DA BUSCA
// ======================================

function capturarGruposFacebook() {

    if (!estaNaBuscaDeGrupos()) {

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


    const grupos = [];


    links.forEach(link => {

        let nome =
            (link.innerText || "")
                .trim()
                .replace(/\s+/g, " ");


        if (!nome) {

            return;

        }


        let url =
            link.href || "";


        if (!url) {

            return;

        }


        try {

            const endereco =
                new URL(url);


            const partes =
                endereco.pathname
                    .split("/")
                    .filter(Boolean);


            const indiceGroups =
                partes.indexOf("groups");


            if (
                indiceGroups === -1 ||
                !partes[indiceGroups + 1]
            ) {

                return;

            }


            const identificador =
                partes[indiceGroups + 1];


            const ignorar = [
                "feed",
                "discover",
                "create",
                "joins",
                "notifications"
            ];


            if (
                ignorar.includes(
                    identificador.toLowerCase()
                )
            ) {

                return;

            }


            url =
                "https://www.facebook.com/groups/" +
                identificador;


        } catch {

            return;

        }


        const repetido =
            grupos.some(
                grupo =>
                    grupo.url === url
            );


        if (repetido) {

            return;

        }


        grupos.push({
            nome,
            url
        });

    });


    salvarGruposCapturados(
        termo,
        grupos
    );

}


// ======================================
// CLIQUE
// ======================================

botao.addEventListener(
    "click",
    capturarGruposFacebook
);
