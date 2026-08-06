console.log("dashboard.js carregado");


async function carregarDashboard() {

    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {

        window.location.href = "login.html";

        return;

    }


    const user = data.session.user;

    console.log("Usuário:", user.id);


    const { data: profile, error } = await window.supabaseClient
        .from("profiles")
        .select("nome, plano, status")
        .eq("id", user.id)
        .single();


    console.log("Profile:", profile);
    console.log("Erro:", error);


    if (!profile) {

        return;

    }


    document.getElementById("nomeUsuario").textContent = profile.nome;

    document.getElementById("planoUsuario").textContent = profile.plano;

    document.getElementById("statusUsuario").textContent = profile.status;


}


carregarDashboard();
