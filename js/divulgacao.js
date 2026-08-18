const botoesMenu = document.querySelectorAll(".divulgacao-menu button");
const conteudoDinamico =
    document.getElementById("divulgacao-conteudo-dinamico");

const cardsVisaoGeral =
    document.querySelector(".cards");

const areasVisaoGeral =
    document.querySelectorAll(".area");


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

    conteudoDinamico.style.display = "none";
    conteudoDinamico.innerHTML = "";
}


function abrirPostarGrupos() {

    esconderVisaoGeral();

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

                <button id="selecionarGrupos"
                    class="btn-divulgacao-primary">
                    👥 Selecionar grupos
                </button>

            </div>


            <div class="publicacao-grid">

                <!-- CONTEÚDO -->

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


                <!-- CONFIGURAÇÕES -->

                <div class="publicacao-box">

                    <h3>⚙️ Configurações</h3>

                    <label>Intervalo entre publicações</label>

                    <select id="intervaloPublicacao">
                        <option value="5">5 minutos</option>
                        <option value="10">10 minutos</option>
                        <option value="15" selected>15 minutos</option>
                        <option value="30">30 minutos</option>
                        <option value="60">1 hora</option>
                    </select>


                    <label>Quando publicar?</label>

                    <select id="tipoPublicacao">
                        <option value="agora">
                            Publicar agora
                        </option>

                        <option value="agendar">
                            Agendar
                        </option>
                    </select>


                    <div id="areaAgendamento"
                        style="display:none;">

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


            <!-- GRUPOS -->

            <div class="publicacao-box"
                style="margin-top:18px;">

                <h3>👥 Grupos selecionados</h3>

                <div id="listaGruposSelecionados"
                    style="
                        padding:25px;
                        text-align:center;
                        color:#64748b;
                    ">

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
                    class="btn-divulgacao-secondary">
                    💾 Salvar campanha
                </button>

                <button
                    id="iniciarPublicacao"
                    class="btn-divulgacao-primary">
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

}

    esconderVisaoGeral();

    conteudoDinamico.style.display = "block";

    conteudoDinamico.innerHTML = `
        <section class="area">

            <h2>📢 Postar em Grupos</h2>

            <p>
                Crie uma publicação e escolha os grupos onde deseja divulgar.
            </p>

            <textarea
                style="
                    width:100%;
                    min-height:160px;
                    padding:14px;
                    margin-top:15px;
                    border:1px solid #cbd5e1;
                    border-radius:10px;
                    box-sizing:border-box;
                    resize:vertical;
                "
                placeholder="Digite o texto da publicação..."
            ></textarea>

        </section>
    `;
}


botoesMenu.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesMenu.forEach(item => {
            item.classList.remove("active");
        });

        botao.classList.add("active");

        const view = botao.dataset.view;

        if (view === "visao-geral") {
            mostrarVisaoGeral();
        }

        if (view === "postar-grupos") {
            abrirPostarGrupos();
        }

    });

});
