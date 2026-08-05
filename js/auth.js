async function cadastrar() {

    alert("Função cadastro iniciou");

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;


    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: senha
    });


    if (error) {
        alert(error.message);
        return;
    }


    const user = data.user;


    if (!user) {
        alert("Usuário não foi criado.");
        return;
    }


    const { error: profileError } = await window.supabaseClient
        .from("profiles")
        .insert({
            id: user.id,
            nome: nome,
            plano: "teste",
            status: "ativo"
        });


    if (profileError) {
        console.log(profileError);
        alert(profileError.message);
        return;
    }


    alert("Conta criada com sucesso!");

    console.log(data);

}



console.log("auth carregado");



async function login() {


    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;


    const { data, error } = await window.supabaseClient.auth.signInWithPassword({

        email: email,
        password: senha

    });


    if (error) {

        alert(error.message);
        return;

    }


    alert("Login realizado com sucesso!");

    window.location.href = "dashboard.html";

}



async function logout() {


    await window.supabaseClient.auth.signOut();

    window.location.href = "login.html";


}



async function verificarUsuario() {


    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {

        window.location.href = "login.html";
        return;

    }


    const email = data.session.user.email;


    const elemento = document.getElementById("usuario");


    if (elemento) {

        elemento.innerHTML = "Usuário conectado: " + email;

    }


}
