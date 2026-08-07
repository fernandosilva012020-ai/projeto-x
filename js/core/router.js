// =================================
// Projeto X - Router
// Controle de telas internas
// =================================

window.ProjetoX = window.ProjetoX || {};

ProjetoX.router = {

    abrir(tela){

        console.log(
            "Abrindo tela:",
            tela
        );


        const area = document.querySelector("#app-view");


        if(!area){

            console.log(
                "Área app-view não encontrada"
            );

            return;

        }


        area.innerHTML = `

            <div class="loading">

                Carregando ${tela}...

            </div>

        `;

    }

};
