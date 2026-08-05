async function carregarPermissoesMenu() {


    const { data: sessionData } = await window.supabaseClient.auth.getSession();


    if (!sessionData.session) {
        return;
    }


    const user = sessionData.session.user;


    const { data: profile } = await window.supabaseClient
        .from("profiles")
        .select("plano")
        .eq("id", user.id)
        .single();



    if (!profile) {
        return;
    }



    const plano = profile.plano;



    const recursosPremium = [
        "divulgacao",
        "sbcforge",
        "grupos"
    ];



    recursosPremium.forEach((recurso)=>{


        const elemento = document.getElementById(recurso);



        if (!elemento) {
            return;
        }



        if (
            plano !== "pro" &&
            plano !== "premium"
        ) {

            elemento.innerHTML += " 🔒";

        }


    });


}
