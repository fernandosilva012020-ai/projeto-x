async function mostrarTeste() {


    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) return;


    const user = data.session.user;



    const { data: profile } = await window.supabaseClient

        .from("profiles")

        .select("plano, inicio_teste")

        .eq("id", user.id)

        .single();



    if (!profile) return;



    if(profile.plano.toLowerCase() !== "teste"){

        return;

    }



    document.getElementById("teste-container").style.display = "block";



    const inicio = new Date(profile.inicio_teste);



    const fim = new Date(inicio);

    fim.setDate(fim.getDate() + 2);



    function atualizar(){



        const agora = new Date();


        const total = fim - inicio;


        const restante = fim - agora;



        if(restante <= 0){


            document.getElementById("teste-tempo").innerHTML =

            "⚠️ Seu teste grátis terminou";


            document.getElementById("barra-teste").style.width="100%";


            return;


        }



        const horas = Math.floor(restante / (1000*60*60));


        const dias = Math.floor(horas / 24);


        const h = horas % 24;



        document.getElementById("teste-tempo").innerHTML =

        `⏳ Restam ${dias} dias e ${h} horas`;



        const usado = total - restante;


        const porcentagem = (usado / total) * 100;



        document.getElementById("barra-teste").style.width =

        porcentagem + "%";


    }



    atualizar();


    setInterval(atualizar,60000);


}
