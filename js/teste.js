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



    if (profile.plano.toLowerCase() !== "teste") {

        return;

    }



    const inicio = new Date(profile.inicio_teste);


    const fim = new Date(inicio);


    fim.setDate(fim.getDate() + 2);



    const agora = new Date();



    const restante = fim - agora;



    if (restante <= 0) {


        document.getElementById("aviso-teste").innerHTML =

        "⚠️ Seu período de teste terminou. Escolha um plano.";


        return;


    }



    const horas = Math.floor(restante / (1000 * 60 * 60));


    const dias = Math.floor(horas / 24);


    const horasRestantes = horas % 24;



    document.getElementById("aviso-teste").innerHTML =

    `🚀 Teste grátis ativo - Restam ${dias} dias e ${horasRestantes} horas`;



}
