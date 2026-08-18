const botoesMenu =
    document.querySelectorAll(".divulgacao-menu button");

const conteudoDinamico =
    document.getElementById("divulgacao-conteudo-dinamico");

const cardsVisaoGeral =
    document.querySelector(".cards");

const areasVisaoGeral =
    document.querySelectorAll(".area");

let gruposSelecionados = [];


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

    if (cardsVisaoGeral) {
        cardsVisaoGeral.style.display = "none";
    }

    areasVisaoGeral.forEach(area => {
        area.style.display = "none";
    });
}


function mostrarVisaoGeral() {

    if (cardsVisaoGeral) {
        cardsVisaoGeral.style.display = "";
    }

    areasVisaoGeral.forEach(area => {
        area.style.display = "";
    });

    if (conteudoDinamico) {
        conteudoDinamico.style.display = "none";
        conteudoDinamico.innerHTML = "";
    }
}


// ======================================
// POSTAR EM GRUPOS
// ======================================

function abrirPostarGrupos() {

    esconderVisaoGeral();

    if (!conteudoDinamico) return;

    conteudoDinamico.style.display = "block";

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

                    <p style="margin:0;color:#64748b;">
                        Configure sua publicação e escolha os grupos.
                    </p>

                </div>

                <button
                    id="selecionarGrupos"
                    class="btn-divulgacao-primary"
                >
                    👥 Selecionar grupos
                </button>

            </div>


            <div class="publicacao-grid">

                <div class="publicacao-box">

                    <h3>✍️ Publicação</h3>

                    <label>Nome da campanha</label>

                    <input
                        id="nomeCampanha"
                        type="text"
                        placeholder="Ex: Divulgação produto"
                    >


                    <label>Texto da publicação</label>

                    <textarea
                        id="textoPublicacao"
                        placeholder="Digite o texto que será publicado..."
                    ></textarea>


                    <label>Imagem ou vídeo</label>

                    <input
                        id="midiaPublicacao"
                        type="file"
                        accept="image/*,video/*"
                    >

                </div>


                <div class="publicacao-box">

                    <h3>⚙️ Configurações</h3>

                    <label>
                        Intervalo entre publicações
                    </label>

                    <select id="intervaloPublicacao">

                        <option value="5">5 minutos</option>

                        <option value="10">10 minutos</option>

                        <option value="15" selected>
                            15 minutos
                        </option>

                        <option value="30">30 minutos</option>

                        <option value="60">1 hora</option>

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

                        <label>Data</label>

                        <input
                            id="dataAgendamento"
                            type="date"
                        >


                        <label>Horário</label>

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
                    id="salvarCampanha"
                    class="btn-divulgacao-secondary"
                >
                    💾 Salvar campanha
                </button>

                <button
                    id="iniciarPublicacao"
                    class="btn-divulgacao-primary"
                >
                    🚀 Iniciar divulgação
                </button>

            </div>

        </section>
    `;


    const tipoPublicacao =
        document.getElementById("tipoPublicacao");

    const areaAgendamento =
        document.getElementById("areaAgendamento");


    tipoPublicacao?.addEventListener("change", () => {

        areaAgendamento.style.display =
            tipoPublicacao.value === "agendar"
                ? "block"
                : "none";
    });


    document
        .getElementById("selecionarGrupos")
        ?.addEventListener(
            "click",
            abrirSeletorGrupos
        );


    renderizarGruposSelecionados();
}


// ======================================
// SELECIONAR GRUPOS
// ======================================

async function abrirSeletorGrupos() {

    const cliente =
        window.supabaseClient;

    if (!cliente) {

        alert("Conexão com o banco não encontrada.");

        return;
    }


    const { data: sessao } =
        await cliente.auth.getSession();

    const usuario =
        sessao?.session?.user;


    if (!usuario) {

        alert("Usuário não conectado.");

        return;
    }


    const { data: grupos, error } =
        await cliente
            .from("igrupos")
            .select("id, name, url, status")
            .eq("user_id", usuario.id)
            .order("created_at", {
                ascending: false
            });


    if (error) {

    console.error("Erro ao carregar grupos:", error);

    alert(
        "Erro ao carregar grupos: " +
        (error.message || "erro desconhecido")
    );

    return;
}


    const modalAntigo =
        document.getElementById(
            "modalSelecionarGrupos"
        );

    modalAntigo?.remove();


    const modal =
        document.createElement("div");

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
                                    item.id === grupo.id
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
                                    value="${grupo.id}"
                                    ${selecionado ? "checked" : ""}
                                >

                                <div>

                                    <strong>
                                        ${escaparHTML(grupo.name)}
                                    </strong>

                                    <div style="
                                        font-size:11px;
                                        color:#64748b;
                                        margin-top:4px;
                                    ">
                                        ${
                                            escaparHTML(
                                                grupo.url || ""
                                            )
                                        }
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
                    id="cancelarGrupos"
                    class="btn-divulgacao-secondary"
                >
                    Cancelar
                </button>


                <button
                    id="confirmarGrupos"
                    class="btn-divulgacao-primary"
                >
                    ✅ Confirmar seleção
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(modal);


    function fecharModal() {
        modal.remove();
    }


    document
        .getElementById("fecharGrupos")
        ?.addEventListener(
            "click",
            fecharModal
        );


    document
        .getElementById("cancelarGrupos")
        ?.addEventListener(
            "click",
            fecharModal
        );


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {
                fecharModal();
            }

        }
    );


    document
        .getElementById("confirmarGrupos")
        ?.addEventListener(
            "click",
            () => {

                const marcados =
                    modal.querySelectorAll(
                        ".grupoCheckbox:checked"
                    );

                gruposSelecionados = [];


                marcados.forEach(input => {

                    const grupo =
                        grupos.find(
                            item =>
                                String(item.id) ===
                                String(input.value)
                        );

                    if (grupo) {

                        gruposSelecionados.push(
                            grupo
                        );
                    }

                });


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


    if (!gruposSelecionados.length) {

        area.innerHTML =
            "Nenhum grupo selecionado.";

        return;
    }


    area.innerHTML = `

        <div style="
            text-align:left;
            margin-bottom:12px;
        ">

            <strong>
                ✅ ${gruposSelecionados.length}
                grupo(s) selecionado(s)
            </strong>

        </div>


        ${gruposSelecionados.map(grupo => `

            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                padding:11px;
                border:1px solid #e2e8f0;
                border-radius:8px;
                margin-bottom:7px;
                text-align:left;
            ">

                <div>

                    <strong>
                        👥 ${escaparHTML(grupo.name)}
                    </strong>

                </div>

            </div>

        `).join("")}
    `;
}


// ======================================
// MENU
// ======================================

botoesMenu.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            botoesMenu.forEach(item => {
                item.classList.remove("active");
            });

            botao.classList.add("active");

            const view =
                botao.dataset.view;


            if (view === "visao-geral") {

                mostrarVisaoGeral();

                return;
            }


            if (view === "postar-grupos") {

                abrirPostarGrupos();

                return;
            }

        }
    );

});
