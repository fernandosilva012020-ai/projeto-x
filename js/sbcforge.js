// =================================
// Projeto X - SBCForge
// Controle da interface
// =================================


document.addEventListener("DOMContentLoaded", () => {


    const modal = document.getElementById("modalSbc");

    const abrir = document.getElementById("novoSbc");

    const fechar = document.getElementById("fecharModal");

    const cancelar = document.getElementById("cancelarSbc");



    if (abrir && modal) {

        abrir.addEventListener("click", () => {

            modal.style.display = "flex";

        });

    }



    if (fechar) {

        fechar.addEventListener("click", () => {

            modal.style.display = "none";

        });

    }



    if (cancelar) {

        cancelar.addEventListener("click", () => {

            modal.style.display = "none";

        });

    }



    window.addEventListener("click", (event) => {


        if (event.target === modal) {

            modal.style.display = "none";

        }


    });



});
