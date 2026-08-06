async function carregarDashboard() {

    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {
        return;
    }


    const { data: perfil, error } = await window.supabaseClient
    .from("profiles")
    .select("nome")
    .eq("id", user.id)
    .single();


console.log(perfil);
console.log(error);


if (perfil) {

    document.getElementById("usuario").innerHTML =
        perfil.nome;

}


    document.getElementById("usuario").innerHTML = `
        👤 ${perfil.nome}
        <br>
        💳 Plano: ${perfil.plano}
        <br>
        🟢 Status: ${perfil.status}
    `;

}

    const { data: perfil } = await window.supabaseClient
    .from("profiles")
    .select("nome")
    .eq("id", user.id)
    .single();


if (perfil) {

    document.getElementById("nomeUsuario").innerText =
        perfil.nome;

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
