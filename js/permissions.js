async function protegerModulo(modulo) {

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



    console.log(profile);



    if (profile.status !== "ativo") {

        alert("Sua conta não está ativa.");

        window.location.href = "assinatura.html";

        return;

    }



    // Controle de módulos

    if (modulo === "divulgacao") {


        if (
            profile.plano !== "pro" &&
            profile.plano !== "premium"
        ) {


            alert("Esse recurso está disponível nos planos Pro e Premium.");

            window.location.href = "assinatura.html";

            return;


        }

    }



}
