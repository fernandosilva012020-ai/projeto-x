// =========================
// CADASTRO
// =========================
async function cadastrar() {

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: {
                nome: nome
            }
        }
    });

    if (error) {
        alert(error.message);
        return;
    }

    if (!data.user) {
        alert("Não foi possível criar o usuário.");
        return;
    }

    alert("Conta criada com sucesso! Agora faça o login.");

    window.location.href = "login.html";
}


// =========================
// LOGIN
// =========================
async function login() {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const { error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "dashboard.html";
}


// =========================
// LOGOUT
// =========================
async function logout() {

    await window.supabaseClient.auth.signOut();

    window.location.href = "login.html";

}


// =========================
// VERIFICAR USUÁRIO
// =========================
async function verificarUsuario() {

    const { data } = await window.supabaseClient.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return;
    }

    const elemento = document.getElementById("usuario");

    if (elemento) {
        elemento.innerHTML = "Usuário conectado: " + data.session.user.email;
    }

}
