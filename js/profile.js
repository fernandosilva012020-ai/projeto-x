async function carregarPerfil() {

    const { data: sessionData } = await window.supabaseClient.auth.getSession();

    const user = sessionData.session?.user;

    if (!user) {
        window.location.href = "login.html";
        return;
    }


    const { data, error } = await window.supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();


    if (error) {
        console.log(error);
        return;
    }


    document.getElementById("nomeUsuario").innerHTML = data.nome;
    document.getElementById("planoUsuario").innerHTML = data.plano;
    document.getElementById("statusUsuario").innerHTML = data.status;

}


carregarPerfil();
