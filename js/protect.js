// =================================
// Projeto X - Proteção de páginas
// =================================


async function protectPage(modulo = null) {


    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {

        window.location.href = "login.html";

        return false;

    }


    const user = data.session.user;



    // Busca dados do perfil

    const { data: profile } = await window.supabaseClient

        .from("profiles")

        .select("plano, inicio_teste")

        .eq("id", user.id)

        .single();



    if (!profile) {

        return true;

    }



    // ==============================
    // Controle do teste grátis
    // ==============================


    if (profile.plano.toLowerCase() === "teste") {


        const inicio = new Date(profile.inicio_teste);


        const agora = new Date();


        const diferenca = agora - inicio;


        const dias = diferenca / (1000 * 60 * 60 * 24);



        if (dias <= 2) {


            console.log("Teste ativo:", dias.toFixed(1), "dias");


            return true;


        } else {



            alert("Seu período de teste terminou. Escolha um plano para continuar.");


            window.location.href = "planos.html";


            return false;


        }


    }



    // ==============================
    // Usuários pagos
    // ==============================


    if (!modulo) {

        return true;

    }



    return true;


}
