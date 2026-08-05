async function verificarAcesso(modulo) {


    const { data: sessionData } = await window.supabaseClient.auth.getSession();


    if (!sessionData.session) {

        window.location.href = "login.html";
        return false;

    }


    const user = sessionData.session.user;



    const { data: profile, error: profileError } = await window.supabaseClient

        .from("profiles")

        .select("plano")

        .eq("id", user.id)

        .single();



    if (profileError) {

        console.log(profileError);
        return false;

    }



    const { data: plano, error: planoError } = await window.supabaseClient

        .from("plans")

        .select("id")

        .eq("nome", profile.plano)

        .single();



    if (planoError) {

        console.log(planoError);
        return false;

    }



    const { data: permissao, error } = await window.supabaseClient

        .from("plan_permissions")

        .select("permitido")

        .eq("plan_id", plano.id)

        .eq("modulo", modulo)

        .single();



    if (error) {

        console.log(error);
        return false;

    }



    if (!permissao.permitido) {


        alert("Seu plano não possui acesso a este recurso.");

        window.location.href = "planos.html";

        return false;


    }



    return true;


}
