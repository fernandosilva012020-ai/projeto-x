// =================================
// Projeto X - Router
// =================================

window.ProjetoX = window.ProjetoX || {};

ProjetoX.router = {

    carregarModulo(modulo) {

        const area = document.querySelector("#app-view");

        if (!area) {
            console.error("app-view não encontrada");
            return;
        }

        if (modulo === "SBCForge") {

            if (
                ProjetoX.SBCForge &&
                typeof ProjetoX.SBCForge.abrir === "function"
            ) {
                ProjetoX.SBCForge.abrir();
                return;
            }

            area.innerHTML = `
                <h2>⚠️ SBCForge não carregou.</h2>
            `;

        }

    }

};
