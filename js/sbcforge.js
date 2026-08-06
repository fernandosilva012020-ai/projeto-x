// =================================
// Projeto X - SBCForge
// Controle da interface + criação de SBC
// =================================


document.addEventListener("DOMContentLoaded", () => {


    const modal = document.getElementById("modalSbc");

    const abrir = document.getElementById("novoSbc");

    const fechar = document.getElementById("fecharModal");

    const cancelar = document.getElementById("cancelarSbc");

    const salvar = document.getElementById("salvarSbc");

    const lista = document.getElementById("listaSbcs");



    // Abrir modal

    if (abrir) {

        abrir.addEventListener("click", () => {

            modal.style.display = "flex";

        });

    }



    // Fechar modal

    function fecharModal() {

        modal.style.display = "none";

    }



    if (fechar) {

        fechar.addEventListener("click", fecharModal);

    }



    if (cancelar) {

        cancelar.addEventListener("click", fecharModal);

    }



    window.addEventListener("click", (event) => {

        if (event.target === modal) {

            fecharModal();

        }

    });




    // Salvar SBC de teste

    if (salvar) {


        salvar.addEventListener("click", () => {



            const nome =
            document.getElementById("nomeSbc").value;



            const categoria =
            document.getElementById("categoriaSbc").value;



            const overall =
            document.getElementById("overallSbc").value;



            const jogadores =
            document.getElementById("jogadoresSbc").value;



            const recompensa =
            document.getElementById("recompensaSbc").value;



            const descricao =
            document.getElementById("descricaoSbc").value;



            if (!nome) {

                alert("Digite o nome do SBC");

                return;

            }



            const vazio =
            document.querySelector(".empty-state");


            if (vazio) {

                vazio.remove();

            }



            const card = document.createElement("div");


            card.className = "card sbc-card";



            card.innerHTML = `

                <h3>
                    ⭐ ${nome}
                </h3>

                <p>
                    Categoria: ${categoria}
                </p>

                <p>
                    Overall: ${overall}
                </p>

                <p>
                    Jogadores: ${jogadores}
                </p>

                <p>
                    🎁 ${recompensa}
                </p>

                <button class="btn-secondary">
                    ✏ Editar
                </button>

                <button class="btn-secondary">
                    🗑 Excluir
                </button>

            `;



            lista.appendChild(card);



            fecharModal();



            // limpa formulário

            document.getElementById("nomeSbc").value = "";

            document.getElementById("recompensaSbc").value = "";

            document.getElementById("descricaoSbc").value = "";



        });


    }



});
