async function carregarDashboard() {

    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {
        return;
    }


    const user = data.session.user;

// PERFIL DO USUÁRIO

const { data: profile, error } = await window.supabaseClient
    .from("profiles")
    .select("nome")
    .eq("id", user.id)
    .single();


if (!error && profile) {

    document.getElementById("nomeUsuario").innerText =
        profile.nome;

}

    // GRUPOS

    const { count: grupos } = await window.supabaseClient
        .from("groups")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);



    document.getElementById("totalGrupos").innerText =
        grupos || 0;



    // TEMPLATES

    const { count: templates } = await window.supabaseClient
        .from("templates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);



    document.getElementById("totalTemplates").innerText =
        templates || 0;




    // CAMPANHAS

    const { count: campanhas } = await window.supabaseClient
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);



    document.getElementById("totalCampanhas").innerText =
        campanhas || 0;



}


carregarDashboard();
