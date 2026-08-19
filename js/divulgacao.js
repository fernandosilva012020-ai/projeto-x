console.log("✅ js/divulgacao.js carregado");

const conteudoDinamico =
    document.getElementById(
        "divulgacao-conteudo-dinamico"
    );

const cardsVisaoGeral =
    document.querySelectorAll(".cards");

const areasVisaoGeral =
    document.querySelectorAll(
        "main.content > section.area"
    );

let gruposSelecionados = [];
let gruposEncontradosAtuais = [];
let campanhaAtivaId = null;


// ======================================
// SEGURANÇA
// ======================================

function escaparHTML(texto = "") {

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ======================================
// DATA E HORA
// ======================================

function formatarDataHora(valor) {

    if (!valor) {

        return "Sem data definida";

    }


    const data =
        new Date(valor);


    if (
        Number.isNaN(
            data.getTime()
        )
    ) {

        return "Data inválida";

    }


    return data.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );
}


// ======================================
// USUÁRIO LOGADO
// ======================================

async function obterContextoUsuario() {

    const cliente =
        window.supabaseClient;


    if (!cliente) {

        throw new Error(
            "Conexão com o banco não encontrada."
        );

    }


    const {
        data,
        error
    } =
        await cliente.auth
            .getSession();


    if (error) {

        throw error;

    }


    const usuario =
        data?.session?.user;


    if (!usuario) {

        throw new Error(
            "Usuário não conectado."
        );

    }


    return {

        cliente,
        usuario

    };
}


// ======================================
// VISÃO GERAL
// ======================================

function esconderVisaoGeral() {

    cardsVisaoGeral
        .forEach(
            card => {

                card.style.display =
                    "none";

            }
        );


    areasVisaoGeral
        .forEach(
            area => {

                area.style.display =
                    "none";

            }
        );

}


function mostrarVisaoGeral() {

    cardsVisaoGeral
        .forEach(
            card => {

                card.style.display =
                    "";

            }
        );


    areasVisaoGeral
        .forEach(
            area => {

                area.style.display =
                    "";

            }
        );


    if (conteudoDinamico) {

        conteudoDinamico.style.display =
            "none";


        conteudoDinamico.innerHTML =
            "";

    }

}


// ======================================
// POSTAR EM GRUPOS
// ======================================

function abrirPostarGrupos() {

    esconderVisaoGeral();


    if (!conteudoDinamico) {

        return;

    }


    conteudoDinamico.style.display =
        "block";


    conteudoDinamico.innerHTML = `

        <section class="area">


            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:15px;
                margin-bottom:20px;
                flex-wrap:wrap;
            ">


                <div>

                    <h2 style="
                        margin:0 0 5px;
                    ">
                        📢 Postar em Grupos
                    </h2>


                    <p style="
                        margin:0;
                        color:#64748b;
                    ">
                        Configure sua publicação e escolha os grupos.
                    </p>

                </div>


                <button
                    type="button"
                    id="selecionarGrupos"
                    class="btn-divulgacao-primary"
                >
                    👥 Selecionar grupos
                </button>


            </div>


            <div class="publicacao-grid">


                <div class="publicacao-box">


                    <h3>
                        ✍️ Publicação
                    </h3>


                    <label>
                        Nome da campanha
                    </label>


                    <input
                        id="nomeCampanha"
                        type="text"
                        placeholder="Ex: Divulgação produto"
                    >


                    <label>
                        Texto da publicação
                    </label>


                    <textarea
                        id="textoPublicacao"
                        placeholder="Digite o texto que será publicado..."
                    ></textarea>


                    <label>
                        Imagem ou vídeo
                    </label>


                    <input
                        id="midiaPublicacao"
                        type="file"
                        accept="image/*,video/*"
                    >


                </div>


                <div class="publicacao-box">


                    <h3>
                        ⚙️ Configurações
                    </h3>


                    <label>
                        Intervalo entre publicações
                    </label>


                    <select id="intervaloPublicacao">

                        <option
                            value="5"
                            selected
                        >
                            5 minutos
                        </option>

                        <option value="10">
                            10 minutos
                        </option>

                        <option value="15">
                            15 minutos
                        </option>

                        <option value="30">
                            30 minutos
                        </option>

                        <option value="60">
                            1 hora
                        </option>

                    </select>


                    <label>
                        Quando publicar?
                    </label>


                    <select id="tipoPublicacao">

                        <option value="agora">
                            Publicar agora
                        </option>

                        <option value="agendar">
                            Agendar
                        </option>

                    </select>


                    <div
                        id="areaAgendamento"
                        style="display:none;"
                    >


                        <label>
                            Data
                        </label>


                        <input
                            id="dataAgendamento"
                            type="date"
                        >


                        <label>
                            Horário
                        </label>


                        <input
                            id="horaAgendamento"
                            type="time"
                        >


                    </div>


                </div>


            </div>


            <div
                class="publicacao-box"
                style="margin-top:18px;"
            >


                <h3>
                    👥 Grupos selecionados
                </h3>


                <div
                    id="listaGruposSelecionados"
                    style="
                        padding:25px;
                        text-align:center;
                        color:#64748b;
                    "
                >
                    Nenhum grupo selecionado.
                </div>


            </div>


            <div style="
                display:flex;
                justify-content:flex-end;
                gap:10px;
                margin-top:20px;
                flex-wrap:wrap;
            ">


                <button
                    type="button"
                    id="salvarCampanha"
                    class="btn-divulgacao-secondary"
                >
                    💾 Salvar campanha
                </button>


                <button
                    type="button"
                    id="iniciarPublicacao"
                    class="btn-divulgacao-primary"
                >
                    🚀 Iniciar divulgação
                </button>


            </div>


        </section>

    `;


    renderizarGruposSelecionados();

}


// ======================================
// DADOS DO FORMULÁRIO
// ======================================

function obterDadosFormularioCampanha() {

    const nome =
        document
            .getElementById(
                "nomeCampanha"
            )
            ?.value
            .trim();


    const conteudo =
        document
            .getElementById(
                "textoPublicacao"
            )
            ?.value
            .trim();


    const intervalo =
        Number(

            document
                .getElementById(
                    "intervaloPublicacao"
                )
                ?.value || 5

        );


    const modo =
        document
            .getElementById(
                "tipoPublicacao"
            )
            ?.value || "agora";


    if (!nome) {

        alert(
            "Digite o nome da campanha."
        );

        return null;

    }


    if (!conteudo) {

        alert(
            "Digite o texto da publicação."
        );

        return null;

    }


    if (
        !gruposSelecionados.length
    ) {

        alert(
            "Selecione pelo menos um grupo."
        );

        return null;

    }


    let agendadoPara =
        null;


    if (
        modo ===
        "agendar"
    ) {

        const data =
            document
                .getElementById(
                    "dataAgendamento"
                )
                ?.value;


        const hora =
            document
                .getElementById(
                    "horaAgendamento"
                )
                ?.value;


        if (
            !data ||
            !hora
        ) {

            alert(
                "Escolha a data e o horário."
            );

            return null;

        }


        const dataLocal =
            new Date(
                `${data}T${hora}:00`
            );


        if (
            Number.isNaN(
                dataLocal.getTime()
            )
        ) {

            alert(
                "Data ou horário inválido."
            );

            return null;

        }


        agendadoPara =
            dataLocal.toISOString();

    }


    return {

        nome,
        conteudo,
        intervalo,
        modo,
        agendadoPara

    };

}


// ======================================
// SALVAR CAMPANHA
// ======================================

async function salvarCampanha() {

    const dados =
        obterDadosFormularioCampanha();


    if (!dados) {

        return;

    }


    const botao =
        document.getElementById(
            "salvarCampanha"
        );


    const textoOriginal =
        botao?.textContent ||
        "💾 Salvar campanha";


    if (botao) {

        botao.disabled =
            true;


        botao.textContent =
            "⏳ Salvando...";

    }


    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        const {
            data: campanha,
            error: erroCampanha
        } =
            await cliente
                .from(
                    "campaigns"
                )
                .insert({

                    user_id:
                        usuario.id,

                    name:
                        dados.nome,

                    content:
                        dados.conteudo,

                    media_url:
                        null,

                    interval_minutes:
                        dados.intervalo,

                    publish_mode:
                        dados.modo,

                    scheduled_at:
                        dados.agendadoPara,

                    status:
                        dados.modo ===
                        "agendar"

                            ? "agendada"

                            : "rascunho"

                })
                .select(
                    "id"
                )
                .single();


        if (erroCampanha) {

            throw erroCampanha;

        }


        const vinculos =
            gruposSelecionados
                .map(
                    grupo => ({

                        campaign_id:
                            campanha.id,

                        group_id:
                            grupo.id,

                        status:
                            "pendente"

                    })
                );


        const {
            error: erroGrupos
        } =
            await cliente
                .from(
                    "campaign_groups"
                )
                .insert(
                    vinculos
                );


        if (erroGrupos) {

            throw new Error(

                "Campanha criada, mas houve erro ao vincular os grupos: " +
                erroGrupos.message

            );

        }


        alert(

            `✅ Campanha "${dados.nome}" salva com sucesso!\n\n` +
            `👥 ${gruposSelecionados.length} grupo(s) vinculados.`

        );


    } catch (erro) {


        console.error(
            "Erro ao salvar campanha:",
            erro
        );


        alert(

            erro?.message ||
            "Erro inesperado ao salvar campanha."

        );


    } finally {


        if (botao) {

            botao.disabled =
                false;


            botao.textContent =
                textoOriginal;

        }

    }

}


// ======================================
// INICIAR DIVULGAÇÃO
// ======================================

async function iniciarDivulgacao() {

    const dados =
        obterDadosFormularioCampanha();


    if (!dados) {

        return;

    }


    if (
        dados.modo ===
        "agendar"
    ) {

        alert(

            "Para uma campanha agendada, use 💾 Salvar campanha. " +
            "O botão 🚀 Iniciar divulgação é para começar agora."

        );

        return;

    }


    const botao =
        document.getElementById(
            "iniciarPublicacao"
        );


    const textoOriginal =
        botao?.textContent ||
        "🚀 Iniciar divulgação";


    if (botao) {

        botao.disabled =
            true;


        botao.textContent =
            "⏳ Preparando...";

    }


    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        const agora =
            new Date()
                .toISOString();


        const {
            data: campanha,
            error: erroCampanha
        } =
            await cliente
                .from(
                    "campaigns"
                )
                .insert({

                    user_id:
                        usuario.id,

                    name:
                        dados.nome,

                    content:
                        dados.conteudo,

                    media_url:
                        null,

                    interval_minutes:
                        dados.intervalo,

                    publish_mode:
                        "agora",

                    scheduled_at:
                        null,

                    status:
                        "em_andamento",

                    started_at:
                        agora,

                    paused_at:
                        null,

                    finished_at:
                        null

                })
                .select(
                    "id, name, interval_minutes, status"
                )
                .single();


        if (erroCampanha) {

            throw erroCampanha;

        }


        const vinculos =
            gruposSelecionados
                .map(
                    grupo => ({

                        campaign_id:
                            campanha.id,

                        group_id:
                            grupo.id,

                        status:
                            "pendente",

                        attempt_count:
                            0,

                        posted_at:
                            null,

                        error_message:
                            null

                    })
                );


        const {
            error: erroVinculos
        } =
            await cliente
                .from(
                    "campaign_groups"
                )
                .insert(
                    vinculos
                );


        if (erroVinculos) {


            await cliente
                .from(
                    "campaigns"
                )
                .update({

                    status:
                        "erro",

                    finished_at:
                        new Date()
                            .toISOString()

                })
                .eq(
                    "id",
                    campanha.id
                )
                .eq(
                    "user_id",
                    usuario.id
                );


            throw new Error(

                "Campanha criada, mas houve erro ao preparar a fila: " +
                erroVinculos.message

            );

        }


        campanhaAtivaId =
            campanha.id;


        window.postMessage(
            {

                source:
                    "PROJETOX_APP",

                type:
                    "PREPARAR_CAMPANHA_DIVULGACAO",

                campanhaId:
                    campanha.id,

                intervaloMinutos:
                    dados.intervalo

            },
            "*"
        );


        alert(

            `✅ Campanha "${dados.nome}" iniciada!\n\n` +

            `👥 ${gruposSelecionados.length} grupo(s) na fila.\n` +

            `⏱️ Intervalo: ${dados.intervalo} minuto(s).\n\n` +

            `A fila já está salva no Supabase.`

        );


        await abrirControleCampanha(
            campanha.id
        );


    } catch (erro) {


        console.error(
            "Erro ao iniciar divulgação:",
            erro
        );


        alert(

            erro?.message ||
            "Erro inesperado ao iniciar divulgação."

        );


    } finally {


        if (botao) {

            botao.disabled =
                false;


            botao.textContent =
                textoOriginal;

        }

    }

}


// ======================================
// SELECIONAR GRUPOS SALVOS
// ======================================

async function abrirSeletorGrupos() {

    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        const {
            data: grupos,
            error
        } =
            await cliente
                .from(
                    "grupos"
                )
                .select(
                    "id, name, url, status"
                )
                .eq(
                    "user_id",
                    usuario.id
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            throw error;

        }


        document
            .getElementById(
                "modalSelecionarGrupos"
            )
            ?.remove();


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "modalSelecionarGrupos";


        modal.style.cssText = `

            position:fixed;
            inset:0;

            background:
            rgba(15,23,42,.60);

            display:flex;
            align-items:center;
            justify-content:center;

            z-index:99999;

        `;


        modal.innerHTML = `

            <div style="

                background:white;

                width:600px;
                max-width:92%;
                max-height:80vh;

                border-radius:14px;

                overflow:hidden;

                box-shadow:
                0 20px 60px
                rgba(0,0,0,.30);

            ">


                <div style="

                    padding:20px;

                    border-bottom:
                    1px solid #e5e7eb;

                    display:flex;

                    justify-content:
                    space-between;

                    align-items:center;

                ">


                    <div>


                        <h2 style="
                            margin:0 0 5px;
                        ">
                            👥 Selecionar grupos
                        </h2>


                        <p style="
                            margin:0;
                            color:#64748b;
                            font-size:13px;
                        ">
                            Escolha os grupos desta divulgação.
                        </p>


                    </div>


                    <button
                        type="button"
                        id="fecharGrupos"
                        style="
                            border:none;
                            background:transparent;
                            font-size:20px;
                            cursor:pointer;
                        "
                    >
                        ✕
                    </button>


                </div>


                <div style="

                    padding:
                    18px 20px;

                    max-height:
                    430px;

                    overflow-y:
                    auto;

                ">


                    ${


                        grupos?.length

                        ?

                        grupos
                            .map(
                                grupo => {


                                    const selecionado =
                                        gruposSelecionados
                                            .some(
                                                item =>
                                                    item.id ===
                                                    grupo.id
                                            );


                                    return `


                                        <label style="

                                            display:flex;

                                            align-items:center;

                                            gap:12px;

                                            padding:13px;

                                            border:
                                            1px solid #e2e8f0;

                                            border-radius:9px;

                                            margin-bottom:8px;

                                            cursor:pointer;

                                        ">


                                            <input
                                                type="checkbox"
                                                class="grupoCheckbox"
                                                value="${escaparHTML(
                                                    grupo.id
                                                )}"
                                                ${
                                                    selecionado
                                                        ? "checked"
                                                        : ""
                                                }
                                            >


                                            <div>


                                                <strong>
                                                    ${escaparHTML(
                                                        grupo.name
                                                    )}
                                                </strong>


                                                <div style="
                                                    font-size:11px;
                                                    color:#64748b;
                                                    margin-top:4px;
                                                    word-break:break-all;
                                                ">
                                                    ${escaparHTML(
                                                        grupo.url ||
                                                        ""
                                                    )}
                                                </div>


                                            </div>


                                        </label>


                                    `;

                                }
                            )
                            .join("")


                        :

                        `

                            <div style="
                                text-align:center;
                                padding:35px;
                                color:#64748b;
                            ">
                                👥 Nenhum grupo cadastrado.
                            </div>

                        `


                    }


                </div>


                <div style="

                    padding:
                    15px 20px;

                    border-top:
                    1px solid #e5e7eb;

                    display:flex;

                    justify-content:
                    flex-end;

                    gap:10px;

                ">


                    <button
                        type="button"
                        id="cancelarGrupos"
                        class="btn-divulgacao-secondary"
                    >
                        Cancelar
                    </button>


                    <button
                        type="button"
                        id="confirmarGrupos"
                        class="btn-divulgacao-primary"
                    >
                        ✅ Confirmar seleção
                    </button>


                </div>


            </div>

        `;


        document.body
            .appendChild(
                modal
            );


        const fecharModal =
            () => {

                modal.remove();

            };


        document
            .getElementById(
                "fecharGrupos"
            )
            ?.addEventListener(
                "click",
                fecharModal
            );


        document
            .getElementById(
                "cancelarGrupos"
            )
            ?.addEventListener(
                "click",
                fecharModal
            );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    fecharModal();

                }

            }
        );


        document
            .getElementById(
                "confirmarGrupos"
            )
            ?.addEventListener(
                "click",
                () => {


                    const marcados =
                        modal
                            .querySelectorAll(
                                ".grupoCheckbox:checked"
                            );


                    gruposSelecionados =
                        [];


                    marcados
                        .forEach(
                            input => {


                                const grupo =
                                    grupos
                                        .find(
                                            item =>

                                                String(
                                                    item.id
                                                ) ===

                                                String(
                                                    input.value
                                                )

                                        );


                                if (grupo) {

                                    gruposSelecionados
                                        .push(
                                            grupo
                                        );

                                }


                            }
                        );


                    renderizarGruposSelecionados();


                    fecharModal();


                }
            );


    } catch (erro) {


        console.error(
            "Erro ao carregar grupos:",
            erro
        );


        alert(

            "Erro ao carregar grupos: " +

            (
                erro?.message ||
                "erro desconhecido"
            )

        );

    }

}


// ======================================
// MOSTRAR GRUPOS SELECIONADOS
// ======================================

function renderizarGruposSelecionados() {

    const area =
        document
            .getElementById(
                "listaGruposSelecionados"
            );


    if (!area) {

        return;

    }


    if (
        !gruposSelecionados.length
    ) {

        area.style.textAlign =
            "center";


        area.innerHTML =
            "Nenhum grupo selecionado.";


        return;

    }


    area.style.textAlign =
        "left";


    area.innerHTML = `


        <div style="
            margin-bottom:12px;
        ">


            <strong>

                ✅
                ${gruposSelecionados.length}

                grupo(s) selecionado(s)

            </strong>


        </div>


        ${


            gruposSelecionados
                .map(
                    grupo => `


                        <div style="

                            padding:11px;

                            border:
                            1px solid #e2e8f0;

                            border-radius:8px;

                            margin-bottom:7px;

                        ">


                            <strong>

                                👥
                                ${escaparHTML(
                                    grupo.name
                                )}

                            </strong>


                        </div>


                    `
                )
                .join("")


        }


    `;

}


// ======================================
// ENCONTRAR GRUPOS
// ======================================

function abrirEncontrarGrupos() {

    esconderVisaoGeral();


    if (!conteudoDinamico) {

        return;

    }


    conteudoDinamico.style.display =
        "block";


    conteudoDinamico.innerHTML = `


        <section class="area">


            <div style="
                margin-bottom:20px;
            ">


                <h2 style="
                    margin:0 0 6px;
                ">
                    🔎 Encontrar grupos
                </h2>


                <p style="
                    margin:0;
                    color:#64748b;
                ">
                    Pesquise grupos do Facebook por palavra-chave.
                </p>


            </div>


            <div class="publicacao-box">


                <label>
                    Palavra-chave ou nicho
                </label>


                <div style="
                    display:flex;
                    gap:10px;
                    margin-top:8px;
                ">


                    <input
                        id="termoBuscaGrupos"
                        type="text"
                        placeholder="Ex: imóveis Campinas, renda extra, carros..."
                    >


                    <button
                        type="button"
                        id="buscarGruposFacebook"
                        class="btn-divulgacao-primary"
                    >
                        🔎 Buscar
                    </button>


                </div>


            </div>


            <div
                class="publicacao-box"
                style="
                    margin-top:18px;
                "
            >


                <div style="

                    display:flex;

                    justify-content:
                    space-between;

                    align-items:center;

                    gap:10px;

                ">


                    <h3 style="
                        margin:0;
                    ">
                        👥 Grupos encontrados
                    </h3>


                    <span
                        id="quantidadeGruposEncontrados"
                    >
                        0 encontrados
                    </span>


                </div>


                <div style="

                    display:flex;

                    justify-content:
                    flex-end;

                    margin-top:
                    15px;

                ">


                    <button
                        type="button"
                        id="carregarResultadosGrupos"
                        class="btn-divulgacao-secondary"
                    >
                        📥 Carregar resultados
                    </button>


                </div>


                <div
                    id="resultadoBuscaGrupos"
                    style="
                        margin-top:20px;
                        padding:35px;
                        text-align:center;
                        color:#64748b;
                    "
                >
                    Faça uma busca para encontrar grupos.
                </div>


            </div>


        </section>


    `;

}


// ======================================
// BUSCAR GRUPOS FACEBOOK
// ======================================

function buscarGruposFacebook() {

    const termo =
        document
            .getElementById(
                "termoBuscaGrupos"
            )
            ?.value
            .trim();


    if (!termo) {

        alert(
            "Digite uma palavra-chave para buscar grupos."
        );

        return;

    }


    window.postMessage(
        {

            source:
                "PROJETOX_APP",

            type:
                "PESQUISAR_GRUPOS_FACEBOOK",

            termo:
                termo

        },
        "*"
    );


    const resultado =
        document
            .getElementById(
                "resultadoBuscaGrupos"
            );


    if (resultado) {


        resultado.innerHTML = `

            🔎 Buscando grupos relacionados a

            <strong>
                ${escaparHTML(
                    termo
                )}
            </strong>...

            <br><br>

            A busca será aberta no Facebook.

        `;


    }

}


// ======================================
// CARREGAR RESULTADOS DA EXTENSÃO
// ======================================

function carregarResultadosGrupos() {

    const resultado =
        document
            .getElementById(
                "resultadoBuscaGrupos"
            );


    if (resultado) {

        resultado.innerHTML =
            "🔄 Carregando grupos capturados...";

    }


    window.postMessage(
        {

            source:
                "PROJETOX_APP",

            type:
                "CARREGAR_GRUPOS_CAPTURADOS"

        },
        "*"
    );

}


// ======================================
// RECEBER GRUPOS DA EXTENSÃO
// ======================================

window.addEventListener(
    "message",
    event => {


        if (
            event.source !==
            window
        ) {

            return;

        }


        if (

            event.data?.source !==
            "PROJETOX_EXTENSION"

            ||

            event.data?.type !==
            "GRUPOS_CAPTURADOS"

        ) {

            return;

        }


        const grupos =
            Array.isArray(
                event.data.grupos
            )

                ? event.data.grupos

                : [];


        const termo =
            event.data.termo ||
            "";


        gruposEncontradosAtuais =
            grupos;


        const resultado =
            document
                .getElementById(
                    "resultadoBuscaGrupos"
                );


        const quantidade =
            document
                .getElementById(
                    "quantidadeGruposEncontrados"
                );


        if (!resultado) {

            return;

        }


        if (quantidade) {

            quantidade.textContent =
                `${grupos.length} encontrados`;

        }


        if (!grupos.length) {

            resultado.innerHTML =
                "Nenhum grupo capturado.";


            return;

        }


        resultado.style.textAlign =
            "left";


        resultado.style.padding =
            "10px";


        resultado.innerHTML = `


            <div style="

                padding:12px;

                margin-bottom:15px;

                background:#f8fafc;

                border-radius:9px;

            ">


                <strong>

                    🔎
                    ${escaparHTML(
                        termo
                    )}

                </strong>


                <div style="

                    margin-top:5px;

                    font-size:12px;

                    color:#64748b;

                ">

                    ${grupos.length}
                    grupos encontrados

                </div>


            </div>


            <div style="

                display:flex;

                gap:10px;

                flex-wrap:wrap;

                margin-bottom:15px;

            ">


                <button
                    type="button"
                    id="selecionarTodosEncontrados"
                    class="btn-divulgacao-secondary"
                >
                    ☑ Selecionar todos
                </button>


                <button
                    type="button"
                    id="desmarcarTodosEncontrados"
                    class="btn-divulgacao-secondary"
                >
                    ☐ Desmarcar todos
                </button>


                <button
                    type="button"
                    id="salvarGruposEncontrados"
                    class="btn-divulgacao-primary"
                >
                    💾 Salvar selecionados
                </button>


            </div>


            ${


                grupos
                    .map(
                        (
                            grupo,
                            indice
                        ) => `


                            <label style="

                                display:flex;

                                gap:12px;

                                align-items:flex-start;

                                padding:12px;

                                margin-bottom:8px;

                                border:
                                1px solid #e2e8f0;

                                border-radius:9px;

                                cursor:pointer;

                            ">


                                <input
                                    type="checkbox"
                                    class="grupoEncontradoCheckbox"
                                    data-indice="${indice}"
                                >


                                <div>


                                    <strong>

                                        👥
                                        ${escaparHTML(
                                            grupo.nome
                                        )}

                                    </strong>


                                    <div style="

                                        margin-top:4px;

                                        font-size:11px;

                                        color:#64748b;

                                        word-break:
                                        break-all;

                                    ">

                                        ${escaparHTML(
                                            grupo.url
                                        )}

                                    </div>


                                </div>


                            </label>


                        `
                    )
                    .join("")


            }


        `;


    }
);


// ======================================
// MARCAR / DESMARCAR TODOS
// ======================================

function selecionarTodosEncontrados(
    valor
) {

    document
        .querySelectorAll(
            ".grupoEncontradoCheckbox"
        )
        .forEach(
            input => {

                input.checked =
                    valor;

            }
        );

}


// ======================================
// SALVAR GRUPOS ENCONTRADOS
// ======================================

async function salvarGruposEncontrados() {

    const marcados =
        document
            .querySelectorAll(
                ".grupoEncontradoCheckbox:checked"
            );


    if (!marcados.length) {

        alert(
            "Selecione pelo menos um grupo."
        );

        return;

    }


    const botao =
        document
            .getElementById(
                "salvarGruposEncontrados"
            );


    const textoOriginal =
        botao?.textContent ||
        "💾 Salvar selecionados";


    if (botao) {

        botao.disabled =
            true;


        botao.textContent =
            "⏳ Salvando...";

    }


    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        const selecionados =
            [];


        marcados
            .forEach(
                input => {


                    const indice =
                        Number(
                            input.dataset
                                .indice
                        );


                    const grupo =
                        gruposEncontradosAtuais[
                            indice
                        ];


                    if (
                        grupo?.url &&
                        grupo?.nome
                    ) {

                        selecionados.push(
                            grupo
                        );

                    }


                }
            );


        const gruposUnicos =
            Array.from(

                new Map(

                    selecionados
                        .map(
                            grupo => [

                                grupo.url,
                                grupo

                            ]
                        )

                ).values()

            );


        const {
            data:
                gruposExistentes,

            error:
                erroExistentes

        } =
            await cliente
                .from(
                    "grupos"
                )
                .select(
                    "url"
                )
                .eq(
                    "user_id",
                    usuario.id
                );


        if (erroExistentes) {

            throw erroExistentes;

        }


        const urlsExistentes =
            new Set(

                (
                    gruposExistentes ||
                    []
                )
                    .map(
                        grupo =>
                            grupo.url
                    )

            );


        const novosGrupos =
            gruposUnicos

                .filter(
                    grupo =>

                        !urlsExistentes
                            .has(
                                grupo.url
                            )

                )

                .map(
                    grupo => ({

                        user_id:
                            usuario.id,

                        name:
                            grupo.nome,

                        url:
                            grupo.url,

                        status:
                            "ativo"

                    })
                );


        if (!novosGrupos.length) {

            alert(
                "✅ Todos os grupos selecionados já estão salvos."
            );

            return;

        }


        const {
            error:
                erroSalvar
        } =
            await cliente
                .from(
                    "grupos"
                )
                .insert(
                    novosGrupos
                );


        if (erroSalvar) {

            throw erroSalvar;

        }


        const repetidos =
            gruposUnicos.length -
            novosGrupos.length;


        let mensagem =
            `✅ ${novosGrupos.length} grupo(s) salvo(s) com sucesso!`;


        if (
            repetidos > 0
        ) {

            mensagem +=
                `\n${repetidos} grupo(s) já estavam cadastrados.`;

        }


        alert(
            mensagem
        );


    } catch (erro) {


        console.error(
            "Erro ao salvar grupos:",
            erro
        );


        alert(

            "Erro ao salvar grupos: " +

            (
                erro?.message ||
                "erro desconhecido"
            )

        );


    } finally {


        if (botao) {

            botao.disabled =
                false;


            botao.textContent =
                textoOriginal;

        }

    }

}


// ======================================
// AGENDAMENTOS
// ======================================

async function abrirAgendamentos() {

    esconderVisaoGeral();


    if (!conteudoDinamico) {

        return;

    }


    conteudoDinamico.style.display =
        "block";


    conteudoDinamico.innerHTML = `


        <section class="area">


            <div style="

                display:flex;

                justify-content:
                space-between;

                align-items:center;

                gap:15px;

                margin-bottom:20px;

                flex-wrap:wrap;

            ">


                <div>


                    <h2 style="
                        margin:0 0 6px;
                    ">
                        📅 Agendamentos
                    </h2>


                    <p style="
                        margin:0;
                        color:#64748b;
                    ">
                        Campanhas agendadas salvas no Projeto X.
                    </p>


                </div>


                <button
                    type="button"
                    id="atualizarAgendamentos"
                    class="btn-divulgacao-secondary"
                >
                    🔄 Atualizar
                </button>


            </div>


            <div
                id="listaAgendamentos"
                class="publicacao-box"
            >


                <div style="
                    padding:35px;
                    text-align:center;
                    color:#64748b;
                ">
                    ⏳ Carregando agendamentos...
                </div>


            </div>


        </section>


    `;


    await carregarAgendamentos();

}


// ======================================
// CARREGAR AGENDAMENTOS
// ======================================

async function carregarAgendamentos() {

    const area =
        document
            .getElementById(
                "listaAgendamentos"
            );


    if (!area) {

        return;

    }


    area.innerHTML = `

        <div style="
            padding:35px;
            text-align:center;
            color:#64748b;
        ">
            ⏳ Carregando agendamentos...
        </div>

    `;


    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        const {
            data:
                campanhas,

            error:
                erroCampanhas
        } =
            await cliente
                .from(
                    "campaigns"
                )
                .select(

                    "id, name, status, publish_mode, scheduled_at, created_at, interval_minutes"

                )
                .eq(
                    "user_id",
                    usuario.id
                )
                .eq(
                    "publish_mode",
                    "agendar"
                )
                .order(
                    "scheduled_at",
                    {
                        ascending:
                            true
                    }
                );


        if (erroCampanhas) {

            throw erroCampanhas;

        }


        if (
            !campanhas?.length
        ) {

            area.innerHTML = `

                <div style="
                    padding:40px;
                    text-align:center;
                    color:#64748b;
                ">
                    📅 Nenhuma campanha agendada ainda.
                </div>

            `;


            return;

        }


        const idsCampanhas =
            campanhas
                .map(
                    campanha =>
                        campanha.id
                );


        let vinculos =
            [];


        if (
            idsCampanhas.length
        ) {


            const {
                data,
                error:
                    erroVinculos
            } =
                await cliente
                    .from(
                        "campaign_groups"
                    )
                    .select(
                        "campaign_id"
                    )
                    .in(
                        "campaign_id",
                        idsCampanhas
                    );


            if (erroVinculos) {

                throw erroVinculos;

            }


            vinculos =
                data ||
                [];


        }


        const contagemGrupos =
            new Map();


        vinculos
            .forEach(
                vinculo => {


                    const atual =
                        contagemGrupos
                            .get(
                                vinculo
                                    .campaign_id
                            ) ||
                        0;


                    contagemGrupos
                        .set(

                            vinculo
                                .campaign_id,

                            atual + 1

                        );


                }
            );


        const agora =
            new Date();


        area.innerHTML = `


            <div style="
                display:flex;
                flex-direction:column;
                gap:12px;
            ">


                ${


                    campanhas
                        .map(
                            campanha => {


                                const quantidadeGrupos =
                                    contagemGrupos
                                        .get(
                                            campanha.id
                                        ) ||
                                    0;


                                const dataAgendada =
                                    campanha
                                        .scheduled_at

                                        ?

                                        new Date(
                                            campanha
                                                .scheduled_at
                                        )

                                        :

                                        null;


                                const passou =
                                    dataAgendada &&
                                    dataAgendada <
                                    agora;


                                let statusTexto =
                                    escaparHTML(

                                        campanha
                                            .status ||

                                        "Sem status"

                                    );


                                if (

                                    campanha.status ===
                                    "agendada"

                                ) {


                                    statusTexto =
                                        passou

                                            ? "⏰ Horário atingido"

                                            : "🟢 Agendada";


                                }


                                if (

                                    campanha.status ===
                                    "cancelada"

                                ) {


                                    statusTexto =
                                        "🔴 Cancelada";


                                }


                                return `


                                    <div style="

                                        border:
                                        1px solid #e2e8f0;

                                        border-radius:
                                        12px;

                                        padding:
                                        18px;

                                        background:
                                        #ffffff;

                                    ">


                                        <div style="

                                            display:flex;

                                            justify-content:
                                            space-between;

                                            align-items:
                                            flex-start;

                                            gap:15px;

                                            flex-wrap:
                                            wrap;

                                        ">


                                            <div style="
                                                min-width:220px;
                                                flex:1;
                                            ">


                                                <h3 style="
                                                    margin:0 0 8px;
                                                ">
                                                    ${escaparHTML(
                                                        campanha.name
                                                    )}
                                                </h3>


                                                <div style="

                                                    display:flex;

                                                    flex-wrap:wrap;

                                                    gap:
                                                    8px 18px;

                                                    color:
                                                    #64748b;

                                                    font-size:
                                                    13px;

                                                ">


                                                    <span>

                                                        📅

                                                        ${escaparHTML(

                                                            formatarDataHora(
                                                                campanha
                                                                    .scheduled_at
                                                            )

                                                        )}

                                                    </span>


                                                    <span>

                                                        👥

                                                        ${quantidadeGrupos}

                                                        grupo(s)

                                                    </span>


                                                    <span>

                                                        ⏱️

                                                        ${Number(

                                                            campanha
                                                                .interval_minutes ||

                                                            5

                                                        )}

                                                        min

                                                    </span>


                                                </div>


                                            </div>


                                            <div style="

                                                display:flex;

                                                align-items:center;

                                                gap:10px;

                                                flex-wrap:wrap;

                                            ">


                                                <div style="

                                                    font-size:13px;

                                                    font-weight:700;

                                                    padding:
                                                    8px 12px;

                                                    border-radius:
                                                    999px;

                                                    background:
                                                    #f8fafc;

                                                    border:
                                                    1px solid #e2e8f0;

                                                    white-space:
                                                    nowrap;

                                                ">

                                                    ${statusTexto}

                                                </div>


                                                ${


                                                    campanha.status ===
                                                    "agendada"

                                                    ?

                                                    `

                                                        <button
                                                            type="button"
                                                            class="btn-divulgacao-secondary cancelarAgendamento"
                                                            data-campanha-id="${campanha.id}"
                                                        >
                                                            ❌ Cancelar
                                                        </button>

                                                    `

                                                    :

                                                    ""


                                                }


                                            </div>


                                        </div>


                                    </div>


                                `;


                            }
                        )
                        .join("")


                }


            </div>


        `;


    } catch (erro) {


        console.error(
            "Erro ao carregar agendamentos:",
            erro
        );


        area.innerHTML = `


            <div style="
                padding:30px;
                text-align:center;
                color:#b91c1c;
            ">

                ❌ Erro ao carregar agendamentos:

                ${escaparHTML(

                    erro?.message ||
                    "erro desconhecido"

                )}

            </div>


        `;


    }

}


// ======================================
// CANCELAR AGENDAMENTO
// ======================================

async function cancelarAgendamento(
    campanhaId
) {

    if (!campanhaId) {

        return;

    }


    const confirmar =
        window.confirm(
            "Deseja realmente cancelar este agendamento?"
        );


    if (!confirmar) {

        return;

    }


    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        const {
            error
        } =
            await cliente
                .from(
                    "campaigns"
                )
                .update({

                    status:
                        "cancelada"

                })
                .eq(
                    "id",
                    campanhaId
                )
                .eq(
                    "user_id",
                    usuario.id
                );


        if (error) {

            throw error;

        }


        alert(
            "✅ Agendamento cancelado com sucesso!"
        );


        await carregarAgendamentos();


    } catch (erro) {


        console.error(
            "Erro ao cancelar agendamento:",
            erro
        );


        alert(

            "Erro ao cancelar agendamento: " +

            (
                erro?.message ||
                "erro desconhecido"
            )

        );


    }

}


// ======================================
// CONTROLE DA CAMPANHA
// ======================================

async function abrirControleCampanha(
    campanhaId
) {

    if (!campanhaId) {

        return;

    }


    campanhaAtivaId =
        campanhaId;


    esconderVisaoGeral();


    if (!conteudoDinamico) {

        return;

    }


    conteudoDinamico.style.display =
        "block";


    conteudoDinamico.innerHTML = `


        <section class="area">


            <div style="
                margin-bottom:20px;
            ">


                <h2 style="
                    margin:0 0 6px;
                ">
                    🚀 Controle da divulgação
                </h2>


                <p style="
                    margin:0;
                    color:#64748b;
                ">
                    Acompanhamento da fila da campanha.
                </p>


            </div>


            <div
                id="controleCampanhaConteudo"
                class="publicacao-box"
            >


                <div style="
                    padding:35px;
                    text-align:center;
                    color:#64748b;
                ">
                    ⏳ Carregando campanha...
                </div>


            </div>


        </section>


    `;


    await carregarControleCampanha(
        campanhaId
    );

}


// ======================================
// CARREGAR CONTROLE DA CAMPANHA
// ======================================

async function carregarControleCampanha(
    campanhaId
) {

    const area =
        document
            .getElementById(
                "controleCampanhaConteudo"
            );


    if (!area) {

        return;

    }


    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        const {
            data:
                campanha,

            error:
                erroCampanha
        } =
            await cliente
                .from(
                    "campaigns"
                )
                .select(

                    "id, name, status, interval_minutes, started_at, paused_at, finished_at"

                )
                .eq(
                    "id",
                    campanhaId
                )
                .eq(
                    "user_id",
                    usuario.id
                )
                .single();


        if (erroCampanha) {

            throw erroCampanha;

        }


        const {
            data:
                vinculos,

            error:
                erroVinculos
        } =
            await cliente
                .from(
                    "campaign_groups"
                )
                .select(

                    "group_id, status, posted_at, error_message, attempt_count"

                )
                .eq(
                    "campaign_id",
                    campanhaId
                );


        if (erroVinculos) {

            throw erroVinculos;

        }


        const listaVinculos =
            vinculos ||
            [];


        const idsGrupos =
            listaVinculos

                .map(
                    item =>
                        item.group_id
                )

                .filter(
                    Boolean
                );


        let grupos =
            [];


        if (
            idsGrupos.length
        ) {


            const {
                data,

                error:
                    erroGrupos

            } =
                await cliente
                    .from(
                        "grupos"
                    )
                    .select(
                        "id, name, url"
                    )
                    .eq(
                        "user_id",
                        usuario.id
                    )
                    .in(
                        "id",
                        idsGrupos
                    );


            if (erroGrupos) {

                throw erroGrupos;

            }


            grupos =
                data ||
                [];


        }


        const gruposPorId =
            new Map(

                grupos
                    .map(
                        grupo => [

                            String(
                                grupo.id
                            ),

                            grupo

                        ]
                    )

            );


        const total =
            listaVinculos.length;


        const pendentes =
            listaVinculos

                .filter(
                    item =>

                        item.status ===
                        "pendente"

                )
                .length;


        const publicados =
            listaVinculos

                .filter(
                    item =>

                        item.status ===
                        "publicado"

                )
                .length;


        const erros =
            listaVinculos

                .filter(
                    item =>

                        item.status ===
                        "erro"

                )
                .length;


        const processados =
            publicados +
            erros;


        const progresso =
            total

                ?

                Math.round(

                    (
                        processados /
                        total
                    ) *
                    100

                )

                :

                0;


        const statusMap = {

            em_andamento:
                "🟢 Em andamento",

            pausada:
                "⏸️ Pausada",

            parada:
                "⛔ Parada",

            concluida:
                "✅ Concluída",

            erro:
                "❌ Erro"

        };


        const statusTexto =

            statusMap[
                campanha.status
            ]

            ||

            escaparHTML(

                campanha.status ||
                "Sem status"

            );


        const podePausar =

            campanha.status ===
            "em_andamento";


        const podeContinuar =

            campanha.status ===
            "pausada";


        const podeParar =

            [
                "em_andamento",
                "pausada"
            ]
                .includes(
                    campanha.status
                );


        const proximos =
            listaVinculos

                .filter(
                    item =>

                        item.status ===
                        "pendente"

                )

                .slice(
                    0,
                    10
                );


        area.innerHTML = `


            <div style="

                display:flex;

                justify-content:
                space-between;

                gap:15px;

                align-items:
                flex-start;

                flex-wrap:
                wrap;

                margin-bottom:
                18px;

            ">


                <div>


                    <h3 style="
                        margin:0 0 7px;
                    ">

                        ${escaparHTML(
                            campanha.name
                        )}

                    </h3>


                    <div style="
                        color:#64748b;
                        font-size:13px;
                    ">

                        ⏱️ Intervalo:

                        ${Number(

                            campanha
                                .interval_minutes ||

                            5

                        )}

                        minuto(s)

                    </div>


                </div>


                <div style="

                    padding:
                    8px 12px;

                    border:
                    1px solid #e2e8f0;

                    border-radius:
                    999px;

                    background:
                    #f8fafc;

                    font-weight:
                    700;

                    font-size:
                    13px;

                ">

                    ${statusTexto}

                </div>


            </div>


            <div style="
                margin-bottom:18px;
            ">


                <div style="

                    display:flex;

                    justify-content:
                    space-between;

                    gap:10px;

                    font-size:
                    13px;

                    margin-bottom:
                    7px;

                ">


                    <strong>
                        Progresso
                    </strong>


                    <span>

                        ${processados}/${total}

                        (${progresso}%)

                    </span>


                </div>


                <div style="

                    height:10px;

                    background:
                    #e2e8f0;

                    border-radius:
                    999px;

                    overflow:hidden;

                ">


                    <div style="

                        width:
                        ${progresso}%;

                        height:100%;

                        background:
                        #111827;

                    "></div>


                </div>


            </div>


            <div style="

                display:grid;

                grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(130px,1fr)
                );

                gap:10px;

                margin-bottom:
                18px;

            ">


                <div style="
                    padding:14px;
                    border:1px solid #e2e8f0;
                    border-radius:10px;
                ">

                    <div style="
                        color:#64748b;
                        font-size:12px;
                    ">
                        Total
                    </div>

                    <strong style="
                        font-size:22px;
                    ">
                        ${total}
                    </strong>

                </div>


                <div style="
                    padding:14px;
                    border:1px solid #e2e8f0;
                    border-radius:10px;
                ">

                    <div style="
                        color:#64748b;
                        font-size:12px;
                    ">
                        Pendentes
                    </div>

                    <strong style="
                        font-size:22px;
                    ">
                        ${pendentes}
                    </strong>

                </div>


                <div style="
                    padding:14px;
                    border:1px solid #e2e8f0;
                    border-radius:10px;
                ">

                    <div style="
                        color:#64748b;
                        font-size:12px;
                    ">
                        Publicados
                    </div>

                    <strong style="
                        font-size:22px;
                    ">
                        ${publicados}
                    </strong>

                </div>


                <div style="
                    padding:14px;
                    border:1px solid #e2e8f0;
                    border-radius:10px;
                ">

                    <div style="
                        color:#64748b;
                        font-size:12px;
                    ">
                        Erros
                    </div>

                    <strong style="
                        font-size:22px;
                    ">
                        ${erros}
                    </strong>

                </div>


            </div>


            <div style="

                display:flex;

                gap:10px;

                flex-wrap:wrap;

                margin-bottom:
                20px;

            ">


                ${


                    podePausar

                    ?

                    `

                        <button
                            type="button"
                            class="btn-divulgacao-secondary acaoCampanhaExecucao"
                            data-acao="pausar"
                            data-campanha-id="${campanha.id}"
                        >
                            ⏸ Pausar
                        </button>

                    `

                    :

                    ""


                }


                ${


                    podeContinuar

                    ?

                    `

                        <button
                            type="button"
                            class="btn-divulgacao-primary acaoCampanhaExecucao"
                            data-acao="continuar"
                            data-campanha-id="${campanha.id}"
                        >
                            ▶ Continuar
                        </button>

                    `

                    :

                    ""


                }


                ${


                    podeParar

                    ?

                    `

                        <button
                            type="button"
                            class="btn-divulgacao-secondary acaoCampanhaExecucao"
                            data-acao="parar"
                            data-campanha-id="${campanha.id}"
                        >
                            ⛔ Parar
                        </button>

                    `

                    :

                    ""


                }


                <button
                    type="button"
                    class="btn-divulgacao-secondary acaoCampanhaExecucao"
                    data-acao="atualizar"
                    data-campanha-id="${campanha.id}"
                >
                    🔄 Atualizar
                </button>


            </div>


            <div style="

                padding:14px;

                background:
                #f8fafc;

                border:
                1px solid #e2e8f0;

                border-radius:
                10px;

                margin-bottom:
                18px;

                color:
                #475569;

                font-size:
                13px;

            ">

                ✅ A fila está salva no Supabase.

                <br>

                Se o navegador ou o computador fechar,
                os grupos pendentes continuam registrados.

                <br>

                A etapa que envia cada grupo para a extensão
                será conectada no próximo passo.

            </div>


            <h3 style="
                margin:0 0 10px;
            ">
                👥 Próximos grupos da fila
            </h3>


            <div>


                ${


                    proximos.length

                    ?

                    proximos
                        .map(
                            item => {


                                const grupo =
                                    gruposPorId
                                        .get(
                                            String(
                                                item.group_id
                                            )
                                        );


                                return `


                                    <div style="

                                        padding:11px;

                                        border:
                                        1px solid #e2e8f0;

                                        border-radius:
                                        8px;

                                        margin-bottom:
                                        7px;

                                    ">


                                        <strong>

                                            👥

                                            ${escaparHTML(

                                                grupo?.name ||
                                                "Grupo"

                                            )}

                                        </strong>


                                        <div style="

                                            margin-top:4px;

                                            font-size:11px;

                                            color:#64748b;

                                            word-break:
                                            break-all;

                                        ">

                                            ${escaparHTML(

                                                grupo?.url ||
                                                ""

                                            )}

                                        </div>


                                    </div>


                                `;


                            }
                        )
                        .join("")

                    :

                    `

                        <div style="
                            padding:25px;
                            text-align:center;
                            color:#64748b;
                            border:1px solid #e2e8f0;
                            border-radius:8px;
                        ">
                            Nenhum grupo pendente.
                        </div>

                    `


                }


            </div>


        `;


    } catch (erro) {


        console.error(
            "Erro ao carregar controle da campanha:",
            erro
        );


        area.innerHTML = `


            <div style="
                padding:30px;
                text-align:center;
                color:#b91c1c;
            ">

                ❌ Erro ao carregar campanha:

                ${escaparHTML(

                    erro?.message ||
                    "erro desconhecido"

                )}

            </div>


        `;


    }

}


// ======================================
// ALTERAR STATUS DA CAMPANHA
// ======================================

async function alterarStatusCampanha(
    campanhaId,
    acao
) {

    if (
        !campanhaId ||
        !acao
    ) {

        return;

    }


    try {


        const {
            cliente,
            usuario
        } =
            await obterContextoUsuario();


        if (
            acao ===
            "atualizar"
        ) {

            await carregarControleCampanha(
                campanhaId
            );


            return;

        }


        let alteracoes =
            {};


        if (
            acao ===
            "pausar"
        ) {

            alteracoes = {

                status:
                    "pausada",

                paused_at:
                    new Date()
                        .toISOString()

            };

        }


        if (
            acao ===
            "continuar"
        ) {

            alteracoes = {

                status:
                    "em_andamento",

                paused_at:
                    null,

                finished_at:
                    null

            };

        }


        if (
            acao ===
            "parar"
        ) {


            const confirmar =
                window.confirm(
                    "Deseja realmente parar esta campanha?"
                );


            if (!confirmar) {

                return;

            }


            alteracoes = {

                status:
                    "parada",

                finished_at:
                    new Date()
                        .toISOString()

            };

        }


        if (
            !Object.keys(
                alteracoes
            ).length
        ) {

            return;

        }


        const {
            error
        } =
            await cliente
                .from(
                    "campaigns"
                )
                .update(
                    alteracoes
                )
                .eq(
                    "id",
                    campanhaId
                )
                .eq(
                    "user_id",
                    usuario.id
                );


        if (error) {

            throw error;

        }


        const tiposMensagem = {

            pausar:
                "PAUSAR_CAMPANHA_DIVULGACAO",

            continuar:
                "CONTINUAR_CAMPANHA_DIVULGACAO",

            parar:
                "PARAR_CAMPANHA_DIVULGACAO"

        };


        if (
            tiposMensagem[
                acao
            ]
        ) {


            window.postMessage(
                {

                    source:
                        "PROJETOX_APP",

                    type:
                        tiposMensagem[
                            acao
                        ],

                    campanhaId:
                        campanhaId

                },
                "*"
            );


        }


        await carregarControleCampanha(
            campanhaId
        );


    } catch (erro) {


        console.error(
            "Erro ao alterar campanha:",
            erro
        );


        alert(

            "Erro ao alterar campanha: " +

            (
                erro?.message ||
                "erro desconhecido"
            )

        );


    }

}


// ======================================
// ÁREAS EM CONSTRUÇÃO
// ======================================

function abrirAreaEmBreve(
    view
) {

    esconderVisaoGeral();


    if (!conteudoDinamico) {

        return;

    }


    const areas = {

        marketplace: [
            "🛒",
            "Marketplace"
        ],

        metricas: [
            "📈",
            "Métricas"
        ],

        contas: [
            "👤",
            "Contas"
        ],

        logs: [
            "📋",
            "Logs"
        ]

    };


    const [
        icone,
        titulo
    ] =

        areas[
            view
        ]

        ||

        [
            "⚙️",
            "Área"
        ];


    conteudoDinamico.style.display =
        "block";


    conteudoDinamico.innerHTML = `


        <section class="area">


            <div style="
                padding:25px;
            ">


                <h2 style="
                    margin:0 0 8px;
                ">

                    ${icone}
                    ${titulo}

                </h2>


                <p style="
                    margin:0;
                    color:#64748b;
                ">

                    Esta área será configurada nas próximas etapas.

                </p>


            </div>


        </section>


    `;

}


// ======================================
// ALTERAR PUBLICAR AGORA / AGENDAR
// ======================================

document.addEventListener(
    "change",
    event => {


        if (
            event.target?.id !==
            "tipoPublicacao"
        ) {

            return;

        }


        const area =
            document
                .getElementById(
                    "areaAgendamento"
                );


        if (!area) {

            return;

        }


        area.style.display =

            event.target.value ===
            "agendar"

                ? "block"

                : "none";


    }
);


// ======================================
// CLIQUES
// ======================================

document.addEventListener(
    "click",
    async event => {


        const elemento =
            event.target;


        if (

            !(
                elemento
                instanceof
                Element
            )

        ) {

            return;

        }


// ======================================
// MENU DA DIVULGAÇÃO
// ======================================

        const botaoMenu =
            elemento
                .closest(
                    ".divulgacao-menu button"
                );


        if (botaoMenu) {


            event.preventDefault();


            document
                .querySelectorAll(
                    ".divulgacao-menu button"
                )
                .forEach(
                    item => {


                        item.classList
                            .remove(
                                "active"
                            );


                    }
                );


            botaoMenu.classList
                .add(
                    "active"
                );


            const view =
                botaoMenu
                    .dataset
                    .view;


            if (
                view ===
                "visao-geral"
            ) {

                mostrarVisaoGeral();

                return;

            }


            if (
                view ===
                "postar-grupos"
            ) {

                abrirPostarGrupos();

                return;

            }


            if (
                view ===
                "grupos"
            ) {

                abrirEncontrarGrupos();

                return;

            }


            if (
                view ===
                "agendamentos"
            ) {

                await abrirAgendamentos();

                return;

            }


            if (

                [
                    "marketplace",
                    "metricas",
                    "contas",
                    "logs"
                ]
                    .includes(
                        view
                    )

            ) {

                abrirAreaEmBreve(
                    view
                );


                return;

            }


        }


// ======================================
// BOTÕES DINÂMICOS
// ======================================

        const botao =
            elemento
                .closest(
                    "button"
                );


        if (!botao) {

            return;

        }


// ======================================
// SELECIONAR GRUPOS
// ======================================

        if (
            botao.id ===
            "selecionarGrupos"
        ) {

            event.preventDefault();


            await abrirSeletorGrupos();


            return;

        }


// ======================================
// SALVAR CAMPANHA
// ======================================

        if (
            botao.id ===
            "salvarCampanha"
        ) {

            event.preventDefault();


            await salvarCampanha();


            return;

        }


// ======================================
// INICIAR DIVULGAÇÃO
// ======================================

        if (
            botao.id ===
            "iniciarPublicacao"
        ) {

            event.preventDefault();


            await iniciarDivulgacao();


            return;

        }


// ======================================
// BUSCAR GRUPOS
// ======================================

        if (
            botao.id ===
            "buscarGruposFacebook"
        ) {

            event.preventDefault();


            buscarGruposFacebook();


            return;

        }


// ======================================
// CARREGAR GRUPOS
// ======================================

        if (
            botao.id ===
            "carregarResultadosGrupos"
        ) {

            event.preventDefault();


            carregarResultadosGrupos();


            return;

        }


// ======================================
// SELECIONAR TODOS
// ======================================

        if (
            botao.id ===
            "selecionarTodosEncontrados"
        ) {

            event.preventDefault();


            selecionarTodosEncontrados(
                true
            );


            return;

        }


// ======================================
// DESMARCAR TODOS
// ======================================

        if (
            botao.id ===
            "desmarcarTodosEncontrados"
        ) {

            event.preventDefault();


            selecionarTodosEncontrados(
                false
            );


            return;

        }


// ======================================
// SALVAR GRUPOS ENCONTRADOS
// ======================================

        if (
            botao.id ===
            "salvarGruposEncontrados"
        ) {

            event.preventDefault();


            await salvarGruposEncontrados();


            return;

        }


// ======================================
// ATUALIZAR AGENDAMENTOS
// ======================================

        if (
            botao.id ===
            "atualizarAgendamentos"
        ) {

            event.preventDefault();


            await carregarAgendamentos();


            return;

        }


// ======================================
// CANCELAR AGENDAMENTO
// ======================================

        const cancelar =
            botao
                .closest(
                    ".cancelarAgendamento"
                );


        if (cancelar) {

            event.preventDefault();


            await cancelarAgendamento(

                cancelar
                    .dataset
                    .campanhaId

            );


            return;

        }


// ======================================
// PAUSAR / CONTINUAR / PARAR
// ======================================

        const acaoCampanha =
            botao
                .closest(
                    ".acaoCampanhaExecucao"
                );


        if (acaoCampanha) {

            event.preventDefault();


            await alterarStatusCampanha(

                acaoCampanha
                    .dataset
                    .campanhaId,

                acaoCampanha
                    .dataset
                    .acao

            );


        }


    }
);


console.log(

    "✅ Divulgação pronta: grupos, campanhas, agendamentos e controle de fila."

);
