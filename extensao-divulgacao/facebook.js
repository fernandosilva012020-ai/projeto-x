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
// STORAGE SEGURO
// ======================================

function lerStorage(chaves, callback) {

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

                    if (chrome.runtime.lastError) {

                        console.warn(
                            "Projeto X:",
                            chrome.runtime.lastError.message
                        );

                        return;
                    }

                    if (typeof callback === "function") {
                        callback(resultado || {});
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


function salvarStorage(dados, callback) {

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

                    if (chrome.runtime.lastError) {

                        console.warn(
                            "Projeto X:",
                            chrome.runtime.lastError.message
                        );

                        return;
                    }

                    if (typeof callback === "function") {
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
// BUSCA DE GRUPOS
// ======================================

function obterTermoBusca() {

    try {

        const url =
            new URL(window.location.href);

        return String(
            url.searchParams.get("q") || ""
        ).trim();

    } catch {

        return "";
    }
}


function estaNaBuscaDeGrupos() {

    return window.location.pathname
        .includes("/search/groups");
}


function normalizarTexto(texto = "") {

    return String(texto)
        .replace(/\s+/g, " ")
        .trim();
}


function obterBlocoDoGrupo(link) {

    let elemento = link;

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
                    .test(texto);

            if (pareceResultado) {
                return elemento;
            }
        }

        elemento =
            elemento.parentElement;
    }

    return link.parentElement;
}


function grupoEhPublico(link) {

    const bloco =
        obterBlocoDoGrupo(link);

    if (!bloco) {
        return false;
    }

    const texto =
        normalizarTexto(
            bloco.innerText || ""
        ).toLowerCase();

    if (
        texto.includes("grupo público")
    ) {
        return true;
    }

    if (
        /(^|\s|·)público(\s|·|$)/i
            .test(texto)
    ) {
        return true;
    }

    if (
        texto.includes("public group")
    ) {
        return true;
    }

    return false;
}


function obterUrlGrupo(link) {

    const url =
        link?.href || "";

    return normalizarUrlGrupo(url);
}


function normalizarUrlGrupo(url) {

    if (!url) {
        return null;
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
            return null;
        }

        const identificador =
            partes[indiceGroups + 1];

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
                identificador.toLowerCase()
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


function obterNomeGrupo(link) {

    const nome =
        normalizarTexto(
            link.innerText || ""
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
        .getElementById(ID_BOTAO_CAPTURA)
        ?.remove();

    if (!estaNaBuscaDeGrupos()) {
        return;
    }

    const botao =
        document.createElement("button");

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
        box-shadow:0 8px 25px rgba(0,0,0,.35);
    `;

    botao.addEventListener(
        "click",
        capturarGruposFacebook
    );

    document.body.appendChild(botao);
}


function salvarGruposCapturados(
    termo,
    grupos
) {

    salvarStorage(
        {
            termoBuscaGrupos: termo,
            gruposEncontrados: grupos,
            filtroGrupos: "publicos",
            dataCapturaGrupos:
                new Date().toISOString()
        },
        () => {

            alert(
                `✅ ${grupos.length} grupo(s) público(s) encontrado(s) para "${termo}".`
            );

            console.log(
                "🌐 Projeto X - grupos públicos:",
                {
                    termo,
                    quantidade: grupos.length,
                    grupos
                }
            );
        }
    );
}


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

    let ignoradosPrivados = 0;
    let ignoradosInvalidos = 0;

    links.forEach(link => {

        const nome =
            obterNomeGrupo(link);

        if (!nome) {
            ignoradosInvalidos++;
            return;
        }

        const url =
            obterUrlGrupo(link);

        if (!url) {
            ignoradosInvalidos++;
            return;
        }

        if (!grupoEhPublico(link)) {
            ignoradosPrivados++;
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
            url,
            tipo: "publico"
        });
    });

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
// CAMPANHA - PRIMEIRO GRUPO DE TESTE
// ======================================

function estaNoGrupo(urlGrupo) {

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
        atual === destino
    );
}


function copiarTexto(texto) {

    const valor =
        String(texto || "");

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
            .writeText(valor)
            .then(() => {

                alert(
                    "✅ Texto copiado. Agora cole no campo de publicação do Facebook."
                );
            })
            .catch(() => {

                copiarTextoFallback(valor);
            });

        return;
    }

    copiarTextoFallback(valor);
}


function copiarTextoFallback(texto) {

    const area =
        document.createElement("textarea");

    area.value = texto;

    area.style.position =
        "fixed";

    area.style.opacity =
        "0";

    document.body.appendChild(area);

    area.focus();
    area.select();

    try {

        document.execCommand("copy");

        alert(
            "✅ Texto copiado. Agora cole no campo de publicação do Facebook."
        );

    } catch {

        alert(
            "⚠️ Não foi possível copiar automaticamente."
        );
    }

    area.remove();
}


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
        new Date().toISOString();

    const atualizada = {
        ...tarefa,
        status: "publicado",
        postedAt: agora,
        atualizadoEm: agora
    };

    const resultado = {
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


function renderizarPainelPublicacao(
    tarefa
) {

    removerPainelPublicacao();

    if (
        !tarefa ||
        !tarefa.grupoUrl ||
        !tarefa.texto ||
        tarefa.status === "publicado" ||
        tarefa.status === "cancelado"
    ) {
        return;
    }

    const noGrupoCorreto =
        estaNoGrupo(
            tarefa.grupoUrl
        );

    const painel =
        document.createElement("div");

    painel.id =
        ID_PAINEL_PUBLICACAO;

    painel.style.cssText = `
        position:fixed;
        right:20px;
        bottom:20px;
        width:360px;
        max-width:calc(100vw - 40px);
        z-index:999999999;
        background:#ffffff;
        color:#111827;
        border:1px solid #dbe2ea;
        border-radius:14px;
        padding:16px;
        box-shadow:0 12px 35px rgba(0,0,0,.28);
        font-family:Arial,sans-serif;
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
                <strong style="font-size:16px;">
                    🚀 Projeto X
                </strong>

                <div style="
                    margin-top:4px;
                    color:#64748b;
                    font-size:12px;
                ">
                    Primeiro grupo da campanha de teste
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
                ${normalizarTexto(
                    tarefa.grupoNome ||
                    "Grupo selecionado"
                )}
            </strong>
        </div>

        <div style="
            padding:10px;
            background:#f8fafc;
            border-radius:9px;
            margin-bottom:12px;
            white-space:pre-wrap;
            max-height:160px;
            overflow:auto;
            font-size:13px;
        ">${
            String(tarefa.texto)
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
        }</div>

        <div style="
            margin-bottom:12px;
            font-size:13px;
            color:${
                noGrupoCorreto
                    ? "#166534"
                    : "#92400e"
            };
        ">
            ${
                noGrupoCorreto
                    ? "✅ Você está no grupo correto."
                    : "⚠️ Abra o grupo correto para fazer o teste."
            }
        </div>

        <div style="
            display:flex;
            flex-wrap:wrap;
            gap:8px;
        ">

            ${
                !noGrupoCorreto

                    ? `
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

                    : `
                        <button
                            type="button"
                            id="projetox-copiar-texto"
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
                            📋 Copiar texto
                        </button>

                        <button
                            type="button"
                            id="projetox-marcar-publicado"
                            style="
                                border:1px solid #cbd5e1;
                                background:#fff;
                                color:#111827;
                                border-radius:8px;
                                padding:10px 12px;
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
}


function carregarPublicacaoAtual() {

    lerStorage(
        [CHAVE_PUBLICACAO_ATUAL],
        resultado => {

            renderizarPainelPublicacao(
                resultado[
                    CHAVE_PUBLICACAO_ATUAL
                ] || null
            );
        }
    );
}


// ======================================
// OUVIR NOVA PUBLICAÇÃO ENVIADA
// ======================================

try {

    chrome.storage.onChanged.addListener(
        (changes, areaName) => {

            if (
                areaName !== "local" ||
                !changes[
                    CHAVE_PUBLICACAO_ATUAL
                ]
            ) {
                return;
            }

            renderizarPainelPublicacao(
                changes[
                    CHAVE_PUBLICACAO_ATUAL
                ].newValue || null
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
    "✅ facebook.js pronto para grupos públicos e campanha de teste."
);
