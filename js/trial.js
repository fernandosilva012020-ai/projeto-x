async function carregarTeste() {

    const { data } = await window.supabaseClient.auth.getSession();

    if (!data.session) {
        return;
    }


    const user = data.session.user;


    const { data: perfil, error } = await window.supabaseClient
        .from("profiles")
        .select("plano, inicio_teste")
        .eq("id", user.id)
        .single();


    if (error || !perfil) {
        console.log(error);
        return;
    }


    if (perfil.plano.toLowerCase() !== "teste") {
        return;
    }


    const banner = document.getElementById("trial-banner");


    if (!banner) {
        return;
    }


    banner.style.display = "block";


    const inicio = new Date(perfil.inicio_teste);


    const fim = new Date(inicio);

    fim.setDate(fim.getDate() + 2);



    function atualizarTeste() {


        const agora = new Date();


        const total = fim - inicio;

        const restante = fim - agora;



        if (restante <= 0) {


            document.getElementById("trial-text").innerHTML =
            "⚠️ Seu período de teste terminou";


            document.getElementById("trial-bar").style.width = "100%";


            return;

        }



        const horas = Math.floor(
            restante / (1000 * 60 * 60)
        );


        const dias = Math.floor(horas / 24);


        const horasRestantes = horas % 24;



        document.getElementById("trial-text").innerHTML =

        `⏳ Restam ${dias} dias e ${horasRestantes} horas`;



        const usado = total - restante;


        const porcentagem = (usado / total) * 100;



        document.getElementById("trial-bar").style.width =

        porcentagem + "%";

    }



    atualizarTeste();


    setInterval(atualizarTeste, 60000);


}
