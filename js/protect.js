async function protectPage() {

    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {

        window.location.href = "login.html";
        return;

    }


    console.log("Usuário autenticado:", data.session.user.email);

}
