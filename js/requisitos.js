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



        if(!sbcId){


            alert("SBC não identificado");


            return;

        }




        const requisito = {


            sbc_id:sbcId,


            titulo:
            document.getElementById("tituloRequisito").value,


            overall_min:
            Number(
            document.getElementById("overallRequisito").value
            ),


            quimica_min:
            Number(
            document.getElementById("quimicaRequisito").value
            ),


            liga:
            document.getElementById("ligaRequisito").value


        };





        const {error} =

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
