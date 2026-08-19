console.log("✅ Projeto X Divulgação carregado no Facebook");


// ======================================
// CONFIGURAÇÃO
// ======================================

const CHAVE_PUBLICACAO_ATUAL =
    "publicacaoProjetoXAtual";

const CHAVE_RESULTADO_PUBLICACAO =
    "resultadoPublicacaoProjetoX";

const ID_BOTAO_CAPTURA =
    "projetox-capturar-grupos";

const ID_PAINEL_PUBLICACAO =
    "projetox-painel-publicacao";

let preenchimentoEmAndamento =
    false;

let chaveUltimoPreenchimento =
    null;


// ======================================
// EXTENSÃO / STORAGE
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


function lerStorage(
    chaves,
    callback
) {

    if (!extensaoEstaAtiva()) {

        console.warn(
            "⚠️ Contexto da extensão indisponível."
        );

        return;
    }


    try {

        chrome.storage.local.get(
            chaves,
            resultado => {

                try {

                    if (
                        chrome.runtime.lastError
                    ) {

                        console.warn(
                            "Projeto X:",
                            chrome.runtime
                                .lastError
                                .message
                        );

                        return;
                    }


                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback(
                            resultado || {}
                        );
                    }

                } catch (erro) {

                    console.warn(
                        "⚠️ Contexto da extensão foi atualizado.",
                        erro
                    );
                }
            }
        );

    } catch (erro) {

        console.warn(
            "⚠️ Erro ao ler storage:",
            erro
        );
    }
}


function salvarStorage(
    dados,
    callback
) {

    if (!extensaoEstaAtiva()) {

        alert(
            "⚠️ A extensão foi atualizada. Feche esta aba do Facebook e abra novamente."
        );

        return;
    }


    try {

        chrome.storage.local.set(
            dados,
            () => {

                try {

                    if (
                        chrome.runtime.lastError
                    ) {

                        console.warn(
                            "Projeto X:",
                            chrome.runtime
                                .lastError
                                .message
                        );

                        return;
                    }


                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback();
                    }

                } catch (erro) {

                    console.warn(
                        "⚠️ Contexto da extensão foi atualizado.",
                        erro
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
// UTILITÁRIOS
// ======================================

function normalizarTexto(
    texto = ""
) {

    return String(texto)
        .replace(/\s+/g, " ")
        .trim();
}


function escaparHTML(
    texto = ""
) {

    return String(texto)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function esperar(
    ms
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


function elementoVisivel(
    elemento
) {

    if (
        !(
            elemento instanceof
            HTMLElement
        )
    ) {

        return false;
    }


    const estilo =
        window.getComputedStyle(
            elemento
        );


    const retangulo =
        elemento
            .getBoundingClientRect();


    return (

        estilo.display !==
        "none"

        &&

        estilo.visibility !==
        "hidden"

        &&

        Number(
            estilo.opacity || 1
        ) !== 0

        &&

        retangulo.width > 0

        &&

        retangulo.height > 0

    );
}


function chaveDaTarefa(
    tarefa
) {

    return (

        `${tarefa?.campanhaId || ""}:` +

        `${tarefa?.groupId || ""}`

    );
}


function atualizarMensagemPainel(
    texto,
    tipo = "normal"
) {

    const area =
        document.getElementById(
            "projetox-status-preenchimento"
        );


    if (!area) {

        return;
    }


    const cores = {

        normal:
            "#475569",

        carregando:
            "#92400e",

        sucesso:
            "#166534",

        erro:
            "#b91c1c"

    };


    area.style.color =
        cores[tipo] ||
        cores.normal;


    area.textContent =
        texto;
}


// ======================================
// BUSCA DE GRUPOS
// ======================================

function obterTermoBusca() {

    try {

        const url =
            new URL(
                window.location.href
            );


        return String(
            url.searchParams.get(
                "q"
            ) || ""
        ).trim();

    } catch {

        return "";
    }
}


function estaNaBuscaDeGrupos() {

    return window.location.pathname
        .includes(
            "/search/groups"
        );
}


function obterBlocoDoGrupo(
    link
) {

    let elemento =
        link;


    for (
        let nivel = 0;
        nivel < 8 && elemento;
        nivel++
    ) {

        const texto =
            normalizarTexto(
                elemento.innerText ||
                ""
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
            bloco.innerText ||
            ""
        )
            .toLowerCase();


    if (
        texto.includes(
            "grupo público"
        )
    ) {

        return true;
    }


    if (
        /(^|\s|·)público(\s|·|$)/i
            .test(
                texto
            )
    ) {

        return true;
    }


    if (
        texto.includes(
            "public group"
        )
    ) {

        return true;
    }


    return false;
}


function obterUrlGrupo(
    link
) {

    const url =
        link?.href ||
        "";


    return normalizarUrlGrupo(
        url
    );
}


function normalizarUrlGrupo(
    url
) {

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


function obterNomeGrupo(
    link
) {

    const nome =
        normalizarTexto(
            link.innerText ||
            ""
        );


    if (!nome) {

        return null;
    }


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
// BOTÃO DE CAPTURA
// ======================================

function criarBotaoCaptura() {

    document
        .getElementById(
            ID_BOTAO_CAPTURA
        )
        ?.remove();


    if (
        !estaNaBuscaDeGrupos()
    ) {

        return;
    }


    const botao =
        document.createElement(
            "button"
        );


    botao.id =
        ID_BOTAO_CAPTURA;


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


    botao.addEventListener(
        "click",
        capturarGruposFacebook
    );


    document.body.appendChild(
        botao
    );
}


function salvarGruposCapturados(
    termo,
    grupos
) {

    salvarStorage(
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
        }
    );
}


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


            if (
                !grupoEhPublico(
                    link
                )
            ) {

                ignoradosPrivados++;

                return;
            }


            const repetido =
                grupos.some(
                    grupo =>
                        grupo.url ===
                        url
                );


            if (
                repetido
            ) {

                return;
            }


            grupos.push(
                {

                    nome,

                    url,

                    tipo:
                        "publico"

                }
            );
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
// CAMPANHA
// ======================================

function estaNoGrupo(
    urlGrupo
) {

    const atual =
        normalizarUrlGrupo(
            window.location.href
        );


    const destino =
        normalizarUrlGrupo(
            urlGrupo
        );


    return Boolean(

        atual &&

        destino &&

        atual ===
        destino

    );
}


// ======================================
// COPIAR TEXTO - FALLBACK
// ======================================

function copiarTexto(
    texto
) {

    const valor =
        String(
            texto ||
            ""
        );


    if (!valor) {

        alert(
            "⚠️ Esta publicação não possui texto."
        );

        return;
    }


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(
                valor
            )
            .then(
                () => {

                    alert(
                        "✅ Texto copiado."
                    );
                }
            )
            .catch(
                () => {

                    copiarTextoFallback(
                        valor
                    );
                }
            );


        return;
    }


    copiarTextoFallback(
        valor
    );
}


function copiarTextoFallback(
    texto
) {

    const area =
        document.createElement(
            "textarea"
        );


    area.value =
        texto;


    area.style.position =
        "fixed";


    area.style.opacity =
        "0";


    document.body.appendChild(
        area
    );


    area.focus();

    area.select();


    try {

        document.execCommand(
            "copy"
        );


        alert(
            "✅ Texto copiado."
        );

    } catch {

        alert(
            "⚠️ Não foi possível copiar automaticamente."
        );
    }


    area.remove();
}


// ======================================
// RESULTADO DA PUBLICAÇÃO
// ======================================

function removerPainelPublicacao() {

    document
        .getElementById(
            ID_PAINEL_PUBLICACAO
        )
        ?.remove();
}


function marcarPublicacaoConcluida(
    tarefa
) {

    const agora =
        new Date()
            .toISOString();


    const atualizada =
        {

            ...tarefa,

            status:
                "publicado",

            postedAt:
                agora,

            atualizadoEm:
                agora

        };


    const resultado =
        {

            campanhaId:
                tarefa.campanhaId,

            groupId:
                tarefa.groupId,

            grupoUrl:
                tarefa.grupoUrl,

            status:
                "publicado",

            postedAt:
                agora

        };


    salvarStorage(
        {

            [CHAVE_PUBLICACAO_ATUAL]:
                atualizada,

            [CHAVE_RESULTADO_PUBLICACAO]:
                resultado

        },
        () => {

            removerPainelPublicacao();


            alert(
                "✅ Publicação marcada como concluída no Projeto X."
            );


            console.log(

                "✅ Projeto X - publicação concluída:",

                resultado

            );
        }
    );
}


// ======================================
// PREENCHIMENTO AUTOMÁTICO
// ======================================

function localizarBotaoAbrirPublicacao() {

    const seletores = [

        '[role="button"]',

        '[tabindex="0"]'

    ];


    const candidatos =
        Array.from(

            document.querySelectorAll(
                seletores.join(
                    ","
                )
            )

        );


    const textosAceitos = [

        "escreva algo",

        "no que você está pensando",

        "criar publicação",

        "crie uma publicação",

        "write something",

        "what's on your mind",

        "create post"

    ];


    return candidatos.find(
        elemento => {

            if (
                !elementoVisivel(
                    elemento
                )
            ) {

                return false;
            }


            if (
                elemento.closest(
                    `#${ID_PAINEL_PUBLICACAO}`
                )
            ) {

                return false;
            }


            const texto =
                normalizarTexto(

                    `${elemento.innerText || ""} ` +

                    `${elemento.getAttribute("aria-label") || ""}`

                )
                    .toLowerCase();


            if (!texto) {

                return false;
            }


            return textosAceitos
                .some(
                    item =>
                        texto.includes(
                            item
                        )
                );
        }
    )

    ||

    null;
}


function localizarEditorPublicacao() {

    const seletores = [

        '[role="dialog"] [role="textbox"][contenteditable="true"]',

        '[role="dialog"] div[contenteditable="true"]',

        '[aria-modal="true"] [role="textbox"][contenteditable="true"]',

        '[aria-modal="true"] div[contenteditable="true"]'

    ];


    const candidatos =
        Array.from(

            document.querySelectorAll(
                seletores.join(
                    ","
                )
            )

        );


    return candidatos.find(
        editor => {

            return (

                elementoVisivel(
                    editor
                )

                &&

                !editor.closest(
                    `#${ID_PAINEL_PUBLICACAO}`
                )

            );
        }
    )

    ||

    null;
}


async function aguardarEditorPublicacao(
    timeoutMs = 15000
) {

    const inicio =
        Date.now();


    while (
        Date.now() -
        inicio <
        timeoutMs
    ) {

        const editor =
            localizarEditorPublicacao();


        if (
            editor
        ) {

            return editor;
        }


        await esperar(
            350
        );
    }


    return null;
}


function inserirTextoNoEditor(
    editor,
    texto
) {

    const valor =
        String(
            texto ||
            ""
        );


    if (
        !editor ||
        !valor
    ) {

        return false;
    }


    try {

        editor.focus();


        const selecao =
            window.getSelection();


        const range =
            document.createRange();


        range.selectNodeContents(
            editor
        );


        selecao.removeAllRanges();


        selecao.addRange(
            range
        );


        let inserido =
            false;


        try {

            inserido =
                document.execCommand(
                    "insertText",
                    false,
                    valor
                );

        } catch {

            inserido =
                false;
        }


        const atual =
            normalizarTexto(

                editor.innerText ||

                editor.textContent ||

                ""

            );


        const esperado =
            normalizarTexto(
                valor
            );


        if (
            !inserido ||
            atual !== esperado
        ) {

            editor.textContent =
                valor;


            try {

                editor.dispatchEvent(

                    new InputEvent(
                        "input",
                        {

                            bubbles:
                                true,

                            inputType:
                                "insertText",

                            data:
                                valor

                        }
                    )

                );

            } catch {

                editor.dispatchEvent(

                    new Event(
                        "input",
                        {

                            bubbles:
                                true

                        }
                    )

                );
            }
        }


        editor.focus();


        return (

            normalizarTexto(

                editor.innerText ||

                editor.textContent ||

                ""

            ).length > 0

        );

    } catch (erro) {

        console.warn(
            "⚠️ Erro ao preencher editor:",
            erro
        );


        return false;
    }
}


async function preencherPublicacaoAutomaticamente(
    tarefa,
    forcar = false
) {

    if (
        !tarefa ||
        !estaNoGrupo(
            tarefa.grupoUrl
        )
    ) {

        return false;
    }


    if (
        preenchimentoEmAndamento
    ) {

        return false;
    }


    const chave =
        chaveDaTarefa(
            tarefa
        );


    if (
        !forcar &&
        chaveUltimoPreenchimento ===
        chave
    ) {

        return true;
    }


    preenchimentoEmAndamento =
        true;


    try {

        atualizarMensagemPainel(

            "⏳ Abrindo a caixa de publicação...",

            "carregando"

        );


        let editor =
            localizarEditorPublicacao();


        if (!editor) {

            let botaoAbrir =
                null;


            for (
                let tentativa = 0;
                tentativa < 20;
                tentativa++
            ) {

                botaoAbrir =
                    localizarBotaoAbrirPublicacao();


                if (
                    botaoAbrir
                ) {

                    break;
                }


                await esperar(
                    400
                );
            }


            if (
                !botaoAbrir
            ) {

                atualizarMensagemPainel(

                    "⚠️ Não encontrei a caixa 'Escreva algo'. Use o botão Preencher novamente.",

                    "erro"

                );


                return false;
            }


            botaoAbrir.click();


            editor =
                await aguardarEditorPublicacao();
        }


        if (!editor) {

            atualizarMensagemPainel(

                "⚠️ A janela de publicação não abriu. Clique em Preencher novamente.",

                "erro"

            );


            return false;
        }


        atualizarMensagemPainel(

            "✍️ Preenchendo o texto automaticamente...",

            "carregando"

        );


        const preenchido =
            inserirTextoNoEditor(

                editor,

                tarefa.texto

            );


        if (
            !preenchido
        ) {

            atualizarMensagemPainel(

                "⚠️ Não consegui preencher o texto. O botão Copiar texto continua disponível.",

                "erro"

            );


            return false;
        }


        chaveUltimoPreenchimento =
            chave;


        atualizarMensagemPainel(

            "✅ Texto preenchido automaticamente. Confira e clique em Publicar no Facebook.",

            "sucesso"

        );


        console.log(

            "✅ Projeto X - texto preenchido automaticamente:",

            {

                campanhaId:
                    tarefa.campanhaId,

                groupId:
                    tarefa.groupId,

                grupoNome:
                    tarefa.grupoNome

            }

        );


        return true;

    } finally {

        preenchimentoEmAndamento =
            false;
    }
}


// ======================================
// PAINEL DA PUBLICAÇÃO
// ======================================

function renderizarPainelPublicacao(
    tarefa
) {

    removerPainelPublicacao();


    if (
        !tarefa ||
        !tarefa.grupoUrl ||
        !tarefa.texto ||
        tarefa.status ===
        "publicado" ||
        tarefa.status ===
        "cancelado"
    ) {

        return;
    }


    const noGrupoCorreto =
        estaNoGrupo(
            tarefa.grupoUrl
        );


    const painel =
        document.createElement(
            "div"
        );


    painel.id =
        ID_PAINEL_PUBLICACAO;


    painel.style.cssText = `

        position:fixed;

        right:20px;
        bottom:20px;

        width:370px;

        max-width:
        calc(100vw - 40px);

        z-index:999999999;

        background:#ffffff;

        color:#111827;

        border:
        1px solid #dbe2ea;

        border-radius:
        14px;

        padding:16px;

        box-shadow:
        0 12px 35px
        rgba(0,0,0,.28);

        font-family:
        Arial,sans-serif;

    `;


    painel.innerHTML = `

        <div style="
            display:flex;
            justify-content:space-between;
            gap:10px;
            align-items:flex-start;
            margin-bottom:10px;
        ">

            <div>

                <strong style="
                    font-size:16px;
                ">
                    🚀 Projeto X
                </strong>


                <div style="
                    margin-top:4px;
                    color:#64748b;
                    font-size:12px;
                ">
                    Assistente de publicação da campanha
                </div>

            </div>


            <button
                type="button"
                id="projetox-fechar-painel"
                style="
                    border:none;
                    background:transparent;
                    cursor:pointer;
                    font-size:18px;
                "
            >
                ✕
            </button>

        </div>


        <div style="
            padding:10px;
            background:#f8fafc;
            border-radius:9px;
            margin-bottom:10px;
        ">

            <div style="
                font-size:12px;
                color:#64748b;
            ">
                Grupo
            </div>


            <strong>

                ${escaparHTML(

                    tarefa.grupoNome ||

                    "Grupo selecionado"

                )}

            </strong>

        </div>


        <div style="
            padding:10px;
            background:#f8fafc;
            border-radius:9px;
            margin-bottom:10px;
            white-space:pre-wrap;
            max-height:140px;
            overflow:auto;
            font-size:13px;
        ">

            ${escaparHTML(
                tarefa.texto
            )}

        </div>


        <div style="
            margin-bottom:9px;
            font-size:13px;
            color:${
                noGrupoCorreto
                    ? "#166534"
                    : "#92400e"
            };
        ">

            ${
                noGrupoCorreto

                    ?

                    "✅ Você está no grupo correto."

                    :

                    "⚠️ Abra o grupo correto para continuar."
            }

        </div>


        <div
            id="projetox-status-preenchimento"
            style="
                margin-bottom:12px;
                font-size:12px;
                line-height:1.4;
                color:#475569;
            "
        >

            ${
                noGrupoCorreto

                    ?

                    "⏳ Preparando preenchimento automático..."

                    :

                    "Aguardando o grupo correto."
            }

        </div>


        <div style="
            display:flex;
            flex-wrap:wrap;
            gap:8px;
        ">

            ${
                !noGrupoCorreto

                    ?

                    `

                        <button
                            type="button"
                            id="projetox-abrir-grupo"
                            style="
                                border:none;
                                background:#111827;
                                color:#fff;
                                border-radius:8px;
                                padding:10px 12px;
                                cursor:pointer;
                                font-weight:bold;
                            "
                        >
                            👥 Abrir grupo
                        </button>

                    `

                    :

                    `

                        <button
                            type="button"
                            id="projetox-preencher-novamente"
                            style="
                                border:none;
                                background:#111827;
                                color:#fff;
                                border-radius:8px;
                                padding:10px 12px;
                                cursor:pointer;
                                font-weight:bold;
                            "
                        >
                            ✍️ Preencher novamente
                        </button>


                        <button
                            type="button"
                            id="projetox-copiar-texto"
                            style="
                                border:
                                1px solid #cbd5e1;

                                background:#fff;

                                color:#111827;

                                border-radius:
                                8px;

                                padding:
                                10px 12px;

                                cursor:pointer;

                                font-weight:bold;
                            "
                        >
                            📋 Copiar texto
                        </button>


                        <button
                            type="button"
                            id="projetox-marcar-publicado"
                            style="
                                border:
                                1px solid #cbd5e1;

                                background:#fff;

                                color:#111827;

                                border-radius:
                                8px;

                                padding:
                                10px 12px;

                                cursor:pointer;

                                font-weight:bold;
                            "
                        >
                            ✅ Já publiquei
                        </button>

                    `
            }

        </div>

    `;


    document.body.appendChild(
        painel
    );


    document
        .getElementById(
            "projetox-fechar-painel"
        )
        ?.addEventListener(
            "click",
            removerPainelPublicacao
        );


    document
        .getElementById(
            "projetox-abrir-grupo"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    tarefa.grupoUrl;
            }
        );


    document
        .getElementById(
            "projetox-preencher-novamente"
        )
        ?.addEventListener(
            "click",
            () => {

                preencherPublicacaoAutomaticamente(
                    tarefa,
                    true
                );
            }
        );


    document
        .getElementById(
            "projetox-copiar-texto"
        )
        ?.addEventListener(
            "click",
            () => {

                copiarTexto(
                    tarefa.texto
                );
            }
        );


    document
        .getElementById(
            "projetox-marcar-publicado"
        )
        ?.addEventListener(
            "click",
            () => {

                marcarPublicacaoConcluida(
                    tarefa
                );
            }
        );


    if (
        noGrupoCorreto
    ) {

        setTimeout(
            () => {

                preencherPublicacaoAutomaticamente(
                    tarefa
                );

            },
            1000
        );
    }
}


// ======================================
// CARREGAR PUBLICAÇÃO
// ======================================

function carregarPublicacaoAtual() {

    lerStorage(
        [
            CHAVE_PUBLICACAO_ATUAL
        ],
        resultado => {

            renderizarPainelPublicacao(

                resultado[
                    CHAVE_PUBLICACAO_ATUAL
                ]

                ||

                null

            );
        }
    );
}


// ======================================
// OUVIR NOVA PUBLICAÇÃO
// ======================================

try {

    chrome.storage.onChanged
        .addListener(
            (
                changes,
                areaName
            ) => {

                if (
                    areaName !==
                    "local"

                    ||

                    !changes[
                        CHAVE_PUBLICACAO_ATUAL
                    ]
                ) {

                    return;
                }


                const novaTarefa =

                    changes[
                        CHAVE_PUBLICACAO_ATUAL
                    ]
                        .newValue

                    ||

                    null;


                if (
                    novaTarefa

                    &&

                    chaveDaTarefa(
                        novaTarefa
                    ) !==
                    chaveUltimoPreenchimento
                ) {

                    chaveUltimoPreenchimento =
                        null;
                }


                renderizarPainelPublicacao(
                    novaTarefa
                );
            }
        );

} catch (erro) {

    console.warn(

        "⚠️ Não foi possível registrar listener do storage:",

        erro

    );
}


// ======================================
// INICIALIZAÇÃO
// ======================================

criarBotaoCaptura();

carregarPublicacaoAtual();


window.addEventListener(
    "pageshow",
    () => {

        criarBotaoCaptura();

        carregarPublicacaoAtual();
    }
);


console.log(

    "✅ facebook.js pronto: grupos públicos + preenchimento automático da publicação."

);
