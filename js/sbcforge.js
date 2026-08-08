// =================================
// Projeto X - SBCForge
// Supabase + Cards + Exclusão
// =================================


function iniciarSBCForge() {


    const modal = document.getElementById("modalSbc");

    const abrir = document.getElementById("novoSbc");

    const fechar = document.getElementById("fecharModal");

    const cancelar = document.getElementById("cancelarSbc");

    const salvar = document.getElementById("salvarSbc");

    const lista = document.getElementById("listaSbcs");



    function abrirModal(){

        if(modal){

            modal.style.display = "flex";

        }

    }



    function fecharModal(){

        if(modal){

            modal.style.display = "none";

        }

    }



    abrir?.addEventListener("click", abrirModal);


    fechar?.addEventListener("click", fecharModal);


    cancelar?.addEventListener("click", fecharModal);



    window.addEventListener("click", (event)=>{


        if(event.target === modal){

            fecharModal();

        }


    });





    // ===============================
    // CARREGAR SBCS
    // ===============================


    async function carregarSbcs(){


        const { data: sessionData } =

        await window.supabaseClient.auth.getSession();



        if(!sessionData.session){

            return;

        }



        const user = sessionData.session.user;




        const { data, error } =

        await window.supabaseClient

        .from("sbcs")

        .select("*")

        .eq("user_id", user.id)

        .order("created_at", {

            ascending:false

        });





        if(error){

            console.log(error);

            return;

        }





        lista.innerHTML = "";





        if(!data || data.length === 0){


            lista.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚽
                </div>

                <h3>
                    Nenhum SBC criado ainda
                </h3>

                <p>
                    Clique em Novo SBC para começar.
                </p>

            </div>

            `;


            return;

        }





        data.forEach((sbc)=>{


            criarCard(sbc);


        });



    }






    // ===============================
    // CRIAR CARD
    // ===============================


    function criarCard(sbc){


        const card = document.createElement("div");


        card.className = "card sbc-card";



        card.innerHTML = `


        <h3>
            ⭐ ${sbc.nome}
        </h3>


        <p>
            🏷️ Categoria:
            ${sbc.categoria || "-"}
        </p>


        <p>
            ⭐ Overall:
            ${sbc.overall || "-"}
        </p>


        <p>
            👥 Jogadores:
            ${sbc.jogadores || "-"}
        </p>


        <p>
            🎁 Recompensa:
            ${sbc.recompensa || "-"}
        </p>



        <div class="card-actions">


    <button 
    class="btn-secondary editar-btn">

        ✏️ Editar

    </button>

    <button class="btn-secondary detalhes-btn">

👁️ Ver detalhes

</button>

    <button 
    class="btn-secondary requisitos-btn">

        ⚙️ Requisitos

    </button>



    <button 
    class="btn-danger excluir-btn">

        🗑️ Excluir

    </button>


</div>


        `;




        const excluir = card.querySelector(".excluir-btn");



        excluir.addEventListener("click", ()=>{


            excluirSbc(sbc.id);


        });

 const requisitos = card.querySelector(".requisitos-btn");


requisitos.addEventListener("click", ()=>{

    abrirRequisitos(sbc.id);

});       

const editar = card.querySelector(".editar-btn");

const detalhes =
card.querySelector(".detalhes-btn");


detalhes?.addEventListener("click", () => {

    if (
        window.ProjetoX &&
        ProjetoX.SBCForge &&
        typeof ProjetoX.SBCForge.abrirDetalhes === "function"
    ) {
        ProjetoX.SBCForge.abrirDetalhes(sbc.id);
    }

});
        
editar.addEventListener("click", ()=>{

    editarSbc(sbc);

});


        carregarRequisitosCard(sbc.id, card);

lista.appendChild(card);


    }

function editarSbc(sbc){

    document.getElementById("nomeSbc").value = sbc.nome || "";

    document.getElementById("categoriaSbc").value = sbc.categoria || "";

    document.getElementById("overallSbc").value = sbc.overall || "";

    document.getElementById("jogadoresSbc").value = sbc.jogadores || "";

    document.getElementById("recompensaSbc").value = sbc.recompensa || "";

    document.getElementById("descricaoSbc").value = sbc.descricao || "";


    salvar.dataset.editando = sbc.id;


    modal.style.display = "flex";

}

function abrirRequisitos(id){


    const modal =
    document.getElementById("modalRequisitos");


    modal.dataset.sbc =
    id;


    modal.style.display =
    "flex";


}    
    // ===============================
// EXCLUIR SBC
// ===============================


async function excluirSbc(id){


    const confirmar = confirm(
        "Tem certeza que deseja excluir este SBC?"
    );



    if(!confirmar){

        return;

    }




    const { error } =

    await window.supabaseClient

    .from("sbcs")

    .delete()

    .eq("id", id);




    if(error){


        console.log(error);


        alert(
            "Erro ao excluir SBC"
        );


        return;

    }



    alert(
        "SBC excluído com sucesso!"
    );



    carregarSbcs();



}







// ===============================
// SALVAR SBC
// ===============================


salvar?.addEventListener("click", async ()=>{



    const { data: sessionData } =

    await window.supabaseClient.auth.getSession();




    if(!sessionData.session){


        alert(
            "Usuário não conectado"
        );


        return;


    }




    const user =
    sessionData.session.user;





    const novoSbc = {


        user_id:user.id,


        nome:
        document.getElementById("nomeSbc").value,



        categoria:
        document.getElementById("categoriaSbc").value,



        overall:
        Number(
            document.getElementById("overallSbc").value
        ),



        jogadores:
        Number(
            document.getElementById("jogadoresSbc").value
        ),



        recompensa:
        document.getElementById("recompensaSbc").value,



        descricao:
        document.getElementById("descricaoSbc").value


    };






    if(!novoSbc.nome){


        alert(
            "Digite o nome do SBC"
        );


        return;

    }






    let error;


if (salvar.dataset.editando) {


    const resultado = await window.supabaseClient

    .from("sbcs")

    .update(novoSbc)

    .eq("id", salvar.dataset.editando);


    error = resultado.error;


    salvar.dataset.editando = "";


} else {


    const resultado = await window.supabaseClient

    .from("sbcs")

    .insert(novoSbc);


    error = resultado.error;


}






    if(error){


        console.log(error);


        alert(
            "Erro ao salvar SBC"
        );


        return;


    }






    alert(
    "SBC salvo com sucesso!"
);



    fecharModal();




    document.getElementById("nomeSbc").value = "";

    document.getElementById("recompensaSbc").value = "";

    document.getElementById("descricaoSbc").value = "";




    carregarSbcs();



});







// ===============================
// INICIAR
// ===============================


carregarSbcs();

// =================================
// MOSTRAR REQUISITOS NO CARD
// =================================


async function carregarRequisitosCard(id, card){


    const requisitos =
    await buscarRequisitos(id);



    if(!requisitos.length){

        return;

    }



    const div =
    document.createElement("div");



    div.className =
    "requisitos-box";



    div.innerHTML = `

    <h4>
        ⚙️ Requisitos
    </h4>


    <p>
        🏆${requisitos.length} desafios criados
    </p>

`;


    card.appendChild(div);

const verRequisitos =
div.querySelector(".ver-requisitos-btn");

verRequisitos?.addEventListener("click", () => {

    window.location.href =
    "sbc-detalhes.html?id=" + id;

});

}

// FINAL iniciarSBCForge
}