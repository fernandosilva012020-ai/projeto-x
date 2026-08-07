// =================================
// Projeto X - SBCForge Module
// Painel interno
// =================================

window.ProjetoX = window.ProjetoX || {};

ProjetoX.SBCForge = {

    abrir(){

        const area = document.getElementById("app-view");

        if(!area){

            console.log(
                "Área SBCForge não encontrada"
            );

            return;

        }


        area.innerHTML = `

            <div class="sbcforge-panel">

                <h1>
                    ⚽ SBCForge
                </h1>


                <p>
                    Criador e gerenciador de SBCs
                </p>



                <div class="cards">


                    <div class="card">

                        <h3>
                            ➕ Criar SBC
                        </h3>

                        <p>
                            Monte um novo desafio
                        </p>

                    </div>



                    <div class="card">

                        <h3>
                            📋 Meus SBCs
                        </h3>

                        <p>
                            Seus desafios criados
                        </p>

                    </div>



                    <div class="card">

                        <h3>
                            🧩 Templates
                        </h3>

                        <p>
                            Modelos prontos
                        </p>

                    </div>


                </div>


            </div>

        `;


    }

};
