async function protectPage() {


    // espera o Supabase carregar

    const { data: sessionData } = await window.supabaseClient.auth.getSession();



    let session = sessionData.session;



    // tenta recuperar novamente se ainda não encontrou

    if (!session) {


        await new Promise(resolve => setTimeout(resolve, 1000));


        const { data: retry } = await window.supabaseClient.auth.getSession();


        session = retry.session;


    }



    if (!session) {


        console.log("Nenhuma sessão encontrada");


        window.location.href = "login.html";


        return false;


    }



    console.log(
        "Usuário autenticado:",
        session.user.email
    );


    return true;


}
