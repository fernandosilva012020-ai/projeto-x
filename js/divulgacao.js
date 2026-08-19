// ======================================
// DIVULGAÇÃO - PROJETO X
// ======================================

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


// ======================================
// SEGURANÇA DE TEXTO
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
// VISÃO GERAL
// ======================================

function esconderVisaoGeral() {

    cardsVisaoGeral.forEach(card => {

        card.style.display =
            "none";

    });


    areasVisaoGeral.forEach(area => {

        area.style.display =
            "none";

    });
}


function mostrarVisaoGeral() {

    cardsVisaoGeral.forEach(card => {

        card.style.display =
            "";

    });


    areasVisaoGeral.forEach(area => {

        area.style.display =
            "";

    });


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

    if (!conteudoDinamico) return;


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
            ">

                <div>

                    <h2 style="margin:0 0 5px;">
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

                        <option value="5">
                            5 minutos
                        </option>

                        <option value="10">
                            10 minutos
                        </option>

                        <option
                            value="15"
                            selected
                        >
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


    const tipoPublicacao =
        document.getElementById(
            "tipoPublicacao"
        );


    const areaAgendamento =
        document.getElementById(
            "areaAgendamento"
        );


    tipoPublicacao
        ?.addEventListener(
            "change",
            () => {

                if (!areaAgendamento) {
                    return;
                }


                areaAgendamento.style.display =
                    tipoPublicacao.value ===
                    "agendar"
                        ? "block"
                        : "none";

            }
        );


    document
        .getElementById(
            "selecionarGrupos"
        )
        ?.addEventListener(
            "click",
            abrirSeletorGrupos
        );

// ======================================
// SALVAR CAMPANHA
// ======================================

document
    .getElementById("salvarCampanha")
    ?.addEventListener(
        "click",
        async () => {

            const cliente =
                window.supabaseClient;

            if (!cliente) {

                alert(
                    "Conexão com o banco não encontrada."
                );

                return;
            }


            // USUÁRIO LOGADO

            const {
                data: sessao,
                error: erroSessao
            } =
                await cliente.auth.getSession();


            if (erroSessao) {

                console.error(
                    erroSessao
                );

                alert(
                    "Erro ao verificar usuário."
                );

                return;
            }


            const usuario =
                sessao?.session?.user;


            if (!usuario) {

                alert(
                    "Usuário não conectado."
                );

                return;
            }


            // DADOS DA CAMPANHA

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
                        ?.value || 15
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

                return;
            }


            if (!conteudo) {

                alert(
                    "Digite o texto da publicação."
                );

                return;
            }


            if (
                !gruposSelecionados.length
            ) {

                alert(
                    "Selecione pelo menos um grupo."
                );

                return;
            }


            // AGENDAMENTO

            let agendadoPara =
                null;


            if (modo === "agendar") {

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


                if (!data || !hora) {

                    alert(
                        "Escolha a data e o horário."
                    );

                    return;
                }


                agendadoPara =
                    new Date(
                        `${data}T${hora}:00`
                    )
                    .toISOString();

            }


            const botao =
                document.getElementById(
                    "salvarCampanha"
                );


            const textoOriginal =
                botao.textContent;


            botao.disabled =
                true;


            botao.textContent =
                "⏳ Salvando...";


            try {

                // CRIAR CAMPANHA

                const {
                    data: campanha,
                    error: erroCampanha
                } =
                    await cliente
                        .from("campaigns")
                        .insert({

                            user_id:
                                usuario.id,

                            name:
                                nome,

                            content:
                                conteudo,

                            media_url:
                                null,

                            interval_minutes:
                                intervalo,

                            publish_mode:
                                modo,

                            scheduled_at:
                                agendadoPara,

                            status:
                                modo === "agendar"
                                    ? "agendada"
                                    : "rascunho"

                        })
                        .select("id")
                        .single();


                if (erroCampanha) {

                    console.error(
                        "Erro campanha:",
                        erroCampanha
                    );

                    alert(
                        "Erro ao salvar campanha: " +
                        erroCampanha.message
                    );

                    return;
                }


                // VINCULAR GRUPOS

                const vinculos =
                    gruposSelecionados.map(
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

                    console.error(
                        "Erro grupos:",
                        erroGrupos
                    );

                    alert(
                        "Campanha criada, mas houve erro ao vincular os grupos: " +
                        erroGrupos.message
                    );

                    return;
                }


                alert(
                    `✅ Campanha "${nome}" salva com sucesso!\n\n👥 ${gruposSelecionados.length} grupo(s) vinculados.`
                );


            } catch (erro) {

                console.error(
                    erro
                );

                alert(
                    "Erro inesperado ao salvar campanha."
                );


            } finally {

                botao.disabled =
                    false;

                botao.textContent =
                    textoOriginal;

            }

        }
    );
    
    renderizarGruposSelecionados();
}


// ======================================
// SELECIONAR GRUPOS SALVOS
// ======================================

async function abrirSeletorGrupos() {

    const cliente =
        window.supabaseClient;


    if (!cliente) {

        alert(
            "Conexão com o banco não encontrada."
        );

        return;
    }


    const {
        data: sessao,
        error: erroSessao
    } =
        await cliente.auth
            .getSession();


    if (erroSessao) {

        console.error(
            "Erro de sessão:",
            erroSessao
        );

        alert(
            "Erro ao verificar sua sessão."
        );

        return;
    }


    const usuario =
        sessao?.session?.user;


    if (!usuario) {

        alert(
            "Usuário não conectado."
        );

        return;
    }


    const {
        data: grupos,
        error
    } =
        await cliente
            .from("grupos")
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
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar grupos:",
            error
        );


        alert(
            "Erro ao carregar grupos: " +
            (
                error.message ||
                "erro desconhecido"
            )
        );

        return;
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
        background:rgba(15,23,42,.60);
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
            box-shadow:0 20px 60px rgba(0,0,0,.30);
        ">

            <div style="
                padding:20px;
                border-bottom:1px solid #e5e7eb;
                display:flex;
                justify-content:space-between;
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
                padding:18px 20px;
                max-height:430px;
                overflow-y:auto;
            ">

                ${
                    grupos?.length

                    ? grupos.map(grupo => {

                        const selecionado =
                            gruposSelecionados.some(
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
                                border:1px solid #e2e8f0;
                                border-radius:9px;
                                margin-bottom:8px;
                                cursor:pointer;
                            ">

                                <input
                                    type="checkbox"
                                    class="grupoCheckbox"
                                    value="${escaparHTML(grupo.id)}"
                                    ${selecionado ? "checked" : ""}
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
                                            grupo.url || ""
                                        )}
                                    </div>

                                </div>

                            </label>

                        `;

                    }).join("")

                    : `

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
                padding:15px 20px;
                border-top:1px solid #e5e7eb;
                display:flex;
                justify-content:flex-end;
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


    document.body.appendChild(
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
                    modal.querySelectorAll(
                        ".grupoCheckbox:checked"
                    );


                gruposSelecionados =
                    [];


                marcados.forEach(
                    input => {

                        const grupo =
                            grupos.find(
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
}


// ======================================
// MOSTRAR GRUPOS SELECIONADOS
// ======================================

function renderizarGruposSelecionados() {

    const area =
        document.getElementById(
            "listaGruposSelecionados"
        );


    if (!area) return;


    if (
        !gruposSelecionados.length
    ) {

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
                ✅ ${gruposSelecionados.length}
                grupo(s) selecionado(s)
            </strong>

        </div>


        ${gruposSelecionados.map(grupo => `

            <div style="
                padding:11px;
                border:1px solid #e2e8f0;
                border-radius:8px;
                margin-bottom:7px;
            ">

                <strong>
                    👥 ${escaparHTML(
                        grupo.name
                    )}
                </strong>

            </div>

        `).join("")}

    `;
}


// ======================================
// ENCONTRAR GRUPOS
// ======================================

function abrirEncontrarGrupos() {

    esconderVisaoGeral();

    if (!conteudoDinamico) return;


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
                style="margin-top:18px;"
            >

                <div style="
                    display:flex;
                    justify-content:space-between;
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
                    justify-content:flex-end;
                    margin-top:15px;
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


// ======================================
// BUSCAR NO FACEBOOK
// ======================================

    document
        .getElementById(
            "buscarGruposFacebook"
        )
        ?.addEventListener(
            "click",
            () => {

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
                    document.getElementById(
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
        );


// ======================================
// CARREGAR RESULTADOS
// ======================================

    document
        .getElementById(
            "carregarResultadosGrupos"
        )
        ?.addEventListener(
            "click",
            () => {

                const resultado =
                    document.getElementById(
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
            document.getElementById(
                "resultadoBuscaGrupos"
            );


        const quantidade =
            document.getElementById(
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
                    🔎 ${escaparHTML(
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


            ${grupos.map(
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
                        border:1px solid #e2e8f0;
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
                                👥 ${escaparHTML(
                                    grupo.nome
                                )}
                            </strong>

                            <div style="
                                margin-top:4px;
                                font-size:11px;
                                color:#64748b;
                                word-break:break-all;
                            ">
                                ${escaparHTML(
                                    grupo.url
                                )}
                            </div>

                        </div>

                    </label>

                `
            ).join("")}

        `;

    }
);


// ======================================
// AÇÕES DOS RESULTADOS ENCONTRADOS
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


        const botao =
            elemento.closest(
                "button"
            );


        if (!botao) return;


// ======================================
// SELECIONAR TODOS
// ======================================

        if (
            botao.id ===
            "selecionarTodosEncontrados"
        ) {

            event.preventDefault();


            document
                .querySelectorAll(
                    ".grupoEncontradoCheckbox"
                )
                .forEach(
                    input => {

                        input.checked =
                            true;

                    }
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


            document
                .querySelectorAll(
                    ".grupoEncontradoCheckbox"
                )
                .forEach(
                    input => {

                        input.checked =
                            false;

                    }
                );


            return;
        }


// ======================================
// SALVAR SELECIONADOS
// ======================================

        if (
            botao.id !==
            "salvarGruposEncontrados"
        ) {

            return;

        }


        event.preventDefault();


        const marcados =
            document.querySelectorAll(
                ".grupoEncontradoCheckbox:checked"
            );


        if (!marcados.length) {

            alert(
                "Selecione pelo menos um grupo."
            );

            return;
        }


        const cliente =
            window.supabaseClient;


        if (!cliente) {

            alert(
                "Conexão com o banco não encontrada."
            );

            return;
        }


        const {
            data: sessao,
            error: erroSessao
        } =
            await cliente.auth
                .getSession();


        if (erroSessao) {

            console.error(
                "Erro de sessão:",
                erroSessao
            );

            alert(
                "Erro ao verificar usuário conectado."
            );

            return;
        }


        const usuario =
            sessao?.session?.user;


        if (!usuario) {

            alert(
                "Usuário não conectado."
            );

            return;
        }


        const selecionados =
            [];


        marcados.forEach(
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

                    selecionados
                        .push(
                            grupo
                        );

                }

            }
        );


        const gruposUnicos =
            Array.from(

                new Map(

                    selecionados.map(
                        grupo => [

                            grupo.url,

                            grupo

                        ]
                    )

                ).values()

            );


        const {
            data: gruposExistentes,
            error: erroExistentes
        } =
            await cliente
                .from("grupos")
                .select("url")
                .eq(
                    "user_id",
                    usuario.id
                );


        if (erroExistentes) {

            console.error(
                "Erro ao verificar grupos:",
                erroExistentes
            );

            alert(
                "Erro ao verificar grupos já cadastrados."
            );

            return;
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


        if (
            !novosGrupos.length
        ) {

            alert(
                "✅ Todos os grupos selecionados já estão salvos."
            );

            return;
        }


        const textoOriginal =
            botao.textContent;


        botao.disabled =
            true;


        botao.textContent =
            "⏳ Salvando...";


        try {

            const {
                error: erroSalvar
            } =
                await cliente
                    .from("grupos")
                    .insert(
                        novosGrupos
                    );


            if (erroSalvar) {

                console.error(
                    "Erro ao salvar grupos:",
                    erroSalvar
                );


                alert(
                    "Erro ao salvar grupos: " +
                    (
                        erroSalvar.message ||
                        "erro desconhecido"
                    )
                );


                return;
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
                "Erro inesperado ao salvar:",
                erro
            );


            alert(
                "Erro inesperado ao salvar grupos."
            );


        } finally {

            botao.disabled =
                false;


            botao.textContent =
                textoOriginal;

        }

    }
);


// ======================================
// OUTRAS ÁREAS DO MENU
// ======================================

function abrirAreaEmBreve(view) {

    esconderVisaoGeral();


    if (!conteudoDinamico) return;


    const areas = {

        marketplace: [
            "🛒",
            "Marketplace"
        ],

        agendamentos: [
            "📅",
            "Agendamentos"
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
        areas[view] ||
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
                    ${icone} ${titulo}
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
// MENU DA DIVULGAÇÃO
// ======================================

document.addEventListener(
    "click",
    event => {

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


        const botao =
            elemento.closest(
                ".divulgacao-menu button"
            );


        if (!botao) return;


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


        botao.classList.add(
            "active"
        );


        const view =
            botao.dataset.view;


        console.log(
            "📌 Menu Divulgação:",
            view
        );


// ======================================
// VISÃO GERAL
// ======================================

        if (
            view ===
            "visao-geral"
        ) {

            mostrarVisaoGeral();

            return;
        }


// ======================================
// POSTAR EM GRUPOS
// ======================================

        if (
            view ===
            "postar-grupos"
        ) {

            abrirPostarGrupos();

            return;
        }


// ======================================
// ENCONTRAR GRUPOS
// ======================================

        if (
            view ===
            "grupos"
        ) {

            abrirEncontrarGrupos();

            return;
        }


// ======================================
// OUTRAS ÁREAS
// ======================================

        if (

            [
                "marketplace",
                "agendamentos",
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

        }

    }
);
