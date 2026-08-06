// =================================
// Projeto X - SBCForge
// Módulo de Requisitos
// =================================


document.addEventListener("DOMContentLoaded", ()=>{


    const modalRequisitos =
    document.getElementById("modalRequisitos");


    const fecharRequisitos =
    document.getElementById("fecharRequisitos");


    const salvarRequisito =
    document.getElementById("salvarRequisito");




    fecharRequisitos?.addEventListener("click", ()=>{

        modalRequisitos.style.display = "none";

    });





    salvarRequisito?.addEventListener("click", async ()=>{


        const sbcId =
        modalRequisitos.dataset.sbc;



        const requisito = {


    sbc_id: sbcId,


    titulo:
    document.getElementById("tituloRequisito").value,



    quantidade_jogadores:
    Number(
    document.getElementById("quantidadeJogadores").value
    ),



    overall_min:
    Number(
    document.getElementById("overallRequisito").value
    ),



    quimica_min:
    Number(
    document.getElementById("quimicaRequisito").value
    ),



    jogadores_especiais:
    Number(
    document.getElementById("especiaisRequisito").value
    ),



    liga:
    document.getElementById("ligaRequisito").value,



    nacionalidade:
    document.getElementById("nacionalidadeRequisito").value,



    clube:
    document.getElementById("clubeRequisito").value


};


        const {error}=

        await window.supabaseClient

        .from("sbc_requisitos")

        .insert(requisito);




        if(error){

            console.log(error);

            alert("Erro ao salvar requisito");

            return;

        }



        alert("Requisito salvo!");

        modalRequisitos.style.display="none";


    });





});





// =================================
// BUSCAR REQUISITOS
// =================================


async function buscarRequisitos(sbcId){



    const {data,error}=

    await window.supabaseClient

    .from("sbc_requisitos")

    .select("*")

    .eq("sbc_id",sbcId);



    if(error){

        console.log(error);

        return [];

    }



    return data || [];

}
