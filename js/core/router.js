// =================================
// Projeto X - Router
// =================================

window.ProjetoX = window.ProjetoX || {};

ProjetoX.router = {

    carregarModulo(modulo) {

        const area = document.querySelector("#app-view");

        if (!area) {
            console.log("app-view não encontrada");
            return;
        }

        if (modulo === "SBCForge") {

            if (
                window.SBCForge &&
                typeof window.SBCForge.abrir === "function"
            ) {
                window.SBCForge.abrir();
            } else {
                area.innerHTML = `
                    <h2>⚠️ SBCForge ainda não carregou.</h2>
                `;

                console.error("SBCForge não carregado.");
            }

        }

    }

};
