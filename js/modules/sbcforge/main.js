// =================================
// Projeto X - SBCForge Module
// Carrega o SBCForge verdadeiro
// =================================

window.ProjetoX = window.ProjetoX || {};

ProjetoX.SBCForge = {

    async abrir() {

        const area = document.getElementById("app-view");

        if (!area) return;

        // Esconde o conteúdo normal do Dashboard
        [...area.parentElement.children].forEach((elemento) => {
            if (elemento !== area) {
                elemento.style.display = "none";
            }
        });

        area.style.display = "block";
        area.innerHTML = "<p>Carregando SBCForge...</p>";

        // Carrega CSS do SBCForge
        if (!document.getElementById("css-sbcforge")) {

            const css = document.createElement("link");

            css.id = "css-sbcforge";
            css.rel = "stylesheet";
            css.href = "css/sbcforge.css";

            document.head.appendChild(css);
        }

        // Busca o SBCForge verdadeiro
        const resposta = await fetch("sbcforge.html");
        const html = await resposta.text();

        const documento = new DOMParser()
            .parseFromString(html, "text/html");

        const conteudo =
            documento.querySelector("main.content");

        const modalRequisitos =
            documento.querySelector("#modalRequisitos");

        if (!conteudo) {

            area.innerHTML =
                "<h2>Erro ao carregar SBCForge</h2>";

            return;
        }

        // Coloca SBCForge dentro do Dashboard
        area.innerHTML = conteudo.innerHTML;

        // Adiciona modal dos requisitos
        if (modalRequisitos) {

            area.appendChild(
                modalRequisitos.cloneNode(true)
            );

        }

        // Inicializa SBCForge
        if (typeof iniciarSBCForge === "function") {

            iniciarSBCForge();

        }

        if (typeof iniciarRequisitos === "function") {
    iniciarRequisitos();
}

        // Marca SBCForge no menu lateral
        document
            .querySelectorAll(".sidebar nav a")
            .forEach((link) => {

                link.classList.remove("active");

            });

        document
            .getElementById("sbcforge")
            ?.classList.add("active");

        // Fechar modal de requisitos
        const modalReq =
            area.querySelector("#modalRequisitos");

        area.onclick = function(event) {

            if (event.target.closest("#fecharRequisitos")) {

                if (modalReq) {

                    modalReq.style.display = "none";

                }

                return;
            }

            if (event.target === modalReq) {

                modalReq.style.display = "none";

            }

        };

    },


    // =================================
    // DETALHES DO SBC DENTRO DO DASHBOARD
    // =================================

    async abrirDetalhes(id) {

        const area = document.getElementById("app-view");

        if (!area) return;

        area.innerHTML =
            "<p>Carregando detalhes...</p>";

        // Busca o SBC
        const { data: sbc, error: erroSbc } =
            await window.supabaseClient
                .from("sbcs")
                .select("*")
                .eq("id", id)
                .single();

        if (erroSbc || !sbc) {

            console.error(erroSbc);

            area.innerHTML =
                "<h2>Erro ao carregar SBC</h2>";

            return;
        }

        // Busca requisitos
        const { data: requisitos, error: erroReq } =
            await window.supabaseClient
                .from("sbc_requisitos")
                .select("*")
                .eq("sbc_id", id);

        if (erroReq) {

            console.error(erroReq);

            area.innerHTML =
                "<h2>Erro ao carregar requisitos</h2>";

            return;
        }

        const listaRequisitos =
            requisitos && requisitos.length
                ? requisitos.map((r, index) => `

                    <div class="requisito-item">

                        <h3>
                            🏆 Desafio ${index + 1}
                        </h3>

                        <p>
                            📌 ${r.titulo || "Desafio"}
                        </p>

                        ${
                            r.quantidade_jogadores
                            ? `<p>👥 Jogadores: ${r.quantidade_jogadores}</p>`
                            : ""
                        }

                        ${
                            r.overall_min
                            ? `<p>⭐ Overall mínimo: ${r.overall_min}</p>`
                            : ""
                        }

                        ${
                            r.quimica_min
                            ? `<p>🧪 Química mínima: ${r.quimica_min}</p>`
                            : ""
                        }

                        ${
                            r.jogadores_especiais
                            ? `<p>✨ Jogadores especiais: ${r.jogadores_especiais}</p>`
                            : ""
                        }

                        ${
                            r.liga
                            ? `<p>🏟️ Liga: ${r.liga}</p>`
                            : ""
                        }

                        ${
                            r.nacionalidade
                            ? `<p>🌍 Nacionalidade: ${r.nacionalidade}</p>`
                            : ""
                        }

                        ${
                            r.clube
                            ? `<p>🛡️ Clube: ${r.clube}</p>`
                            : ""
                        }

                    </div>

                `).join("")
                : "<p>Nenhum requisito cadastrado.</p>";

        // Monta os detalhes dentro do Dashboard
        area.innerHTML = `

            <section class="forge-header">

                <div>

                    <h1>
                        🏆 ${sbc.nome}
                    </h1>

                    <span>
                        Detalhes do SBC
                    </span>

                </div>

                <button
                    id="voltarSbcForge"
                    class="btn-secondary">

                    ⬅️ Voltar para Meus SBCs

                </button>

            </section>


            <div class="card">

                <h2>
                    ⚙️ Requisitos
                </h2>

                <div id="listaRequisitos">

                    ${listaRequisitos}

                </div>

            </div>

        `;

        // Botão voltar sem sair do Dashboard
        document
            .getElementById("voltarSbcForge")
            ?.addEventListener("click", () => {

                ProjetoX.SBCForge.abrir();

            });

    }

};