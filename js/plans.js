async function carregarPlanos() {


    const { data: planos, error } = await window.supabaseClient
        .from("plans")
        .select("*")
        .eq("ativo", true);



    if (error) {

        console.log(error);
        return;

    }



    const area = document.getElementById("listaPlanos");


    area.innerHTML = "";



    planos.forEach(plano => {



        area.innerHTML += `

        <a href="#" onclick="escolherPlano('${plano.id}')">

        💳

        <span>
        ${plano.nome}
        </span>


        <small>
        R$ ${plano.preco}
        </small>


        <small>
        ${plano.recursos}
        </small>


        </a>

        `;


    });


}
