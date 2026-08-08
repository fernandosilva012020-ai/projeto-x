// =================================
// Projeto X - SBCForge
// Módulo de Requisitos
// =================================

function iniciarRequisitos() {

    document.addEventListener("click", async function(event) {

        // FECHAR MODAL
        if (event.target.closest("#fecharRequisitos")) {

            const modalRequisitos =
                document.getElementById("modalRequisitos");

            if (modalRequisitos) {
                modalRequisitos.style.display = "none";
            }

            return;
        }


        // SALVAR REQUISITO
        if (event.target.closest("#salvarRequisito")) {

            const modalRequisitos =
                document.getElementById("modalRequisitos");

            if (!modalRequisitos) return;

            const sbcId =
                modalRequisitos.dataset.sbc;

            if (!sbcId) {

                alert("SBC não identificado");

                return;
            }

            const requisito = {

                sbc_id: sbcId,

                titulo:
                    document.getElementById("tituloRequisito")?.value || "",

                quantidade_jogadores:
                    Number(
                        document.getElementById("quantidadeJogadores")?.value || 0
                    ),

                overall_min:
                    Number(
                        document.getElementById("overallRequisito")?.value || 0
                    ),

                quimica_min:
                    Number(
                        document.getElementById("quimicaRequisito")?.value || 0
                    ),

                jogadores_especiais:
                    Number(
                        document.getElementById("especiaisRequisito")?.value || 0
                    ),

                liga:
                    document.getElementById("ligaRequisito")?.value || "",

                nacionalidade:
                    document.getElementById("nacionalidadeRequisito")?.value || "",

                clube:
                    document.getElementById("clubeRequisito")?.value || ""

            };

            const { error } =
                await window.supabaseClient
                    .from("sbc_requisitos")
                    .insert(requisito);

            if (error) {

                console.error(error);

                alert("Erro ao salvar requisito");

                return;
            }

            alert("Requisito salvo!");

            modalRequisitos.style.display = "none";

            if (
                window.ProjetoX &&
                ProjetoX.SBCForge &&
                typeof ProjetoX.SBCForge.abrir === "function"
            ) {
                ProjetoX.SBCForge.abrir();
            }
        }

    });

}


// =================================
// BUSCAR REQUISITOS
// =================================

async function buscarRequisitos(sbcId) {

    const { data, error } =
        await window.supabaseClient
            .from("sbc_requisitos")
            .select("*")
            .eq("sbc_id", sbcId);

    if (error) {

        console.error(error);

        return [];
    }

    return data || [];
}