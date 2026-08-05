async function protectPage(modulo = null) {


    const { data: sessionData } = await window.supabaseClient.auth.getSession();


    if (!sessionData.session) {

        console.log("Sem sessão");

        window.location.href = "login.html";

        return false;

    }


    const user = sessionData.session.user;


    console.log("Usuário autenticado:", user.email);



    // Se a página não tiver módulo, só protege o login

    if (!modulo) {

        return true;

    }



    const { data: profile, error: profileError } = await window.supabaseClient

        .from("profiles")

        .select("plano")

        .eq("id", user.id)

        .single();



    if (profileError || !profile) {

        console.log(profileError);

        return false;

    }




    const { data: plano, error: planoError } = await window.supabaseClient

        .from("plans")

        .select("id")

        .ilike("nome", profile.plano)

        .single();



    if (planoError || !plano) {

        console.log(planoError);

        return false;

    }





    const { data: permissao, error: permissaoError } = await window.supabaseClient

        .from("plan_permissions")

        .select("permitido")

        .eq("plan_id", plano.id)

        .eq("modulo", modulo)

        .single();




    if (permissaoError) {

        console.log(permissaoError);

        return false;

    }




    if (!permissao.permitido) {


        alert("Seu plano não possui acesso a este recurso.");


        window.location.href = "planos.html";


        return false;


    }



    return true;


}
