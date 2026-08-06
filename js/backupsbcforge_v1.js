// =================================
// Projeto X - SBCForge
// Supabase + Interface
// =================================


document.addEventListener("DOMContentLoaded", () => {


    const modal = document.getElementById("modalSbc");

    const abrir = document.getElementById("novoSbc");

    const fechar = document.getElementById("fecharModal");

    const cancelar = document.getElementById("cancelarSbc");

    const salvar = document.getElementById("salvarSbc");

    const lista = document.getElementById("listaSbcs");



    function abrirModal(){

        modal.style.display = "flex";

    }


    function fecharModal(){

        modal.style.display = "none";

    }



    abrir?.addEventListener("click", abrirModal);

    fechar?.addEventListener("click", fecharModal);

    cancelar?.addEventListener("click", fecharModal);



    window.addEventListener("click", (e)=>{

        if(e.target === modal){

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

        .order("created_at", { ascending:false });



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



        data.forEach(criarCard);



    }





    function criarCard(sbc){



        const card = document.createElement("div");


        card.className = "card sbc-card";



        card.innerHTML = `

        <h3>
        ⭐ ${sbc.nome}
        </h3>


        <p>
        Categoria: ${sbc.categoria || "-"}
        </p>


        <p>
        Overall: ${sbc.overall || "-"}
        </p>


        <p>
        Jogadores: ${sbc.jogadores || "-"}
        </p>


        <p>
        🎁 ${sbc.recompensa || "-"}
        </p>


        `;



        lista.appendChild(card);


    }





    // ===============================
    // SALVAR SBC
    // ===============================


    salvar?.addEventListener("click", async ()=>{


        const { data: sessionData } =
        await window.supabaseClient.auth.getSession();



        if(!sessionData.session){

            alert("Usuário não conectado");

            return;

        }



        const user = sessionData.session.user;




        const novoSbc = {


            user_id:user.id,


            nome:
            document.getElementById("nomeSbc").value,


            categoria:
            document.getElementById("categoriaSbc").value,


            overall:
            Number(document.getElementById("overallSbc").value),


            jogadores:
            Number(document.getElementById("jogadoresSbc").value),


            recompensa:
            document.getElementById("recompensaSbc").value,


            descricao:
            document.getElementById("descricaoSbc").value


        };



        if(!novoSbc.nome){


            alert("Digite o nome do SBC");

            return;

        }




        const { error } =
        await window.supabaseClient

        .from("sbcs")

        .insert(novoSbc);




        if(error){


            console.log(error);

            alert("Erro ao salvar SBC");

            return;

        }




        alert("SBC criado com sucesso!");



        fecharModal();



        carregarSbcs();



    });




    carregarSbcs();



});
