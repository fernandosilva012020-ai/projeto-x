console.log("dashboard.js carregado");

// =================================
// Projeto X - Dashboard
// Carregar dados do usuário
// =================================


async function carregarDashboard() {

    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {

        window.location.href = "login.html";

        return;

    }


    const user = data.session.user;



    // Busca perfil

    const { data: profile, error } = await window.supabaseClient

        .from("profiles")

        .select("nome, plano, status")

        .eq("id", user.id)

        .single();



    if (error) {

        console.log(error.message);

        return;

    }



    // Nome

    document.getElementById("nomeUsuario").innerHTML =
        profile.nome;



    // Plano

    document.getElementById("planoUsuario").innerHTML =
        profile.plano;



    // Status

    document.getElementById("statusUsuario").innerHTML =
        profile.status;


}



// iniciar

carregarDashboard();
