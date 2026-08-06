async function carregarDashboard() {

    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {

        window.location.href = "login.html";

        return;

    }


    const user = data.session.user;


    const { data: profile, error } = await window.supabaseClient
        .from("profiles")
        .select("nome, plano, status")
        .eq("id", user.id)
        .single();


    if (error) {

        console.log(error.message);

        return;

    }


    document.getElementById("nomeUsuario").innerHTML =
        profile.nome;


    document.getElementById("planoUsuario").innerHTML =
        profile.plano;


    document.getElementById("statusUsuario").innerHTML =
        profile.status;

}


carregarDashboard();
