// =================================
// Projeto X - Proteção de páginas
// =================================


async function protectPage(modulo = null) {


    // Aguarda o Supabase carregar a sessão

    const { data } = await window.supabaseClient.auth.getSession();


    let session = data.session;



    // Segunda tentativa (evita erro de carregamento)

    if (!session) {


        await new Promise(resolve => setTimeout(resolve, 1500));


        const { data: retry } = await window.supabaseClient.auth.getSession();


        session = retry.session;


    }



    if (!session) {


        console.log("Usuário sem sessão");


        window.location.href = "login.html";


        return false;


    }



    console.log(
        "Usuário logado:",
        session.user.email
    );



    // Se for somente login, libera

    if (!modulo) {

        return true;

    }



    // Busca plano do usuário

    const { data: profile, error } = await window.supabaseClient

        .from("profiles")

        .select("plano")

        .eq("id", session.user.id)

        .single();



    if (error || !profile) {


        console.log(error);


        return true;


    }



    // Busca plano

    const { data: plano } = await window.supabaseClient

        .from("plans")

        .select("id")

        .ilike("nome", profile.plano)

        .single();



    if (!plano) {

        return true;

    }



    // Busca permissão

    const { data: permissao } = await window.supabaseClient

        .from("plan_permissions")

        .select("permitido")

        .eq("plan_id", plano.id)

        .eq("modulo", modulo)

        .single();



    if (permissao && permissao.permitido === false) {


        alert("Seu plano não possui acesso a este recurso.");


        window.location.href = "planos.html";


        return false;


    }



    return true;


}
