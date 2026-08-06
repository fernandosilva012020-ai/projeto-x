// =================================
// SBCForge - Página de Detalhes
// =================================


document.addEventListener("DOMContentLoaded", async ()=>{


    const params = new URLSearchParams(
        window.location.search
    );


    const sbcId = params.get("id");



    if(!sbcId){

        document.getElementById("nomeSbc").innerHTML =
        "SBC não encontrado";

        return;

    }



    carregarSbc(sbcId);



});





async function carregarSbc(id){



    const {data:sbc,error}=

    await window.supabaseClient

    .from("sbcs")

    .select("*")

    .eq("id",id)

    .single();




    if(error){


        console.log(error);


        return;

    }




    document.getElementById("nomeSbc").innerHTML =

    "🏆 " + sbc.nome;




    carregarRequisitos(id);



}







async function carregarRequisitos(id){



    const {data,error}=

    await window.supabaseClient

    .from("sbc_requisitos")

    .select("*")

    .eq("sbc_id",id);




    const lista =

    document.getElementById("listaRequisitos");





    if(error){


        lista.innerHTML =
        "Erro ao carregar requisitos";


        console.log(error);


        return;

    }




    if(!data.length){


        lista.innerHTML =
        "Nenhum requisito cadastrado";


        return;

    }






    lista.innerHTML = data.map((r,index)=>`


        <div class="requisito-item">


            <h3>
            🏆 Desafio ${index+1}
            </h3>


            <p>
            📌 ${r.titulo || "Desafio"}
            </p>


            <p>
            ⭐ Overall:
            ${r.overall_min || "-"}
            </p>


            <p>
            🧪 Química:
            ${r.quimica_min || "-"}
            </p>


            <p>
            🌎 Liga:
            ${r.liga || "-"}
            </p>



        </div>


    `).join("");



}
