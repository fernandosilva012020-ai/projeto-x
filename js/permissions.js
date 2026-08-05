async function verificarPlano() {

    const { data: sessionData } = await window.supabaseClient.auth.getSession();

    if (!sessionData.session) {
        window.location.href = "login.html";
        return;
    }


    const user = sessionData.session.user;


    const { data: profile, error } = await window.supabaseClient
        .from("profiles")
        .select("plano,status")
        .eq("id", user.id)
        .single();


    if (error) {
        console.log(error);
        return;
    }


    console.log("Plano:", profile.plano);
    console.log("Status:", profile.status);


    return profile;

}
