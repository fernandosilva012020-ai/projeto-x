// =================================
// Projeto X - SBCForge Module
// Painel interno
// =================================

console.log("SBCForge module carregado");

window.ProjetoX = window.ProjetoX || {};

ProjetoX.SBCForge = {

    abrir(){

        window.SBCForge = {

    abrir(){

        const area = document.querySelector("#app-view");

        if(!area) return;

        area.innerHTML = `

            <h1>⚽ SBCForge</h1>

            <p>Criador e gerenciador de SBCs</p>

            <div class="cards">

                <div class="card">
                    <h3>➕ Criar SBC</h3>
                    <p>Monte um novo desafio</p>
                </div>

                <div class="card">
                    <h3>📋 Meus SBCs</h3>
                    <p>Veja seus desafios</p>
                </div>

                <div class="card">
                    <h3>🧩 Templates</h3>
                    <p>Modelos prontos</p>
                </div>

            </div>

        `;

    }

};
