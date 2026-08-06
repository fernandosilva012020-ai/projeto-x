// =================================
// Projeto X - Auth
// Cadastro / Login / Logout
// =================================


console.log("auth.js carregado");

function mostrarMensagem(texto, tipo) {

    const msg = document.getElementById("mensagem");

    if (!msg) {
        alert(texto);
        return;
    }

    msg.style.display = "block";
    msg.className = "mensagem " + tipo;
msg.innerHTML = texto;

}

// ================================
// CADASTRO
// ================================

async function cadastrarUsuario() {


    const nome = document.getElementById("nome").value;

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;



    if (!nome || !email || !senha) {

        mostrarMensagem("⚠️ Preencha todos os campos.", "erro");

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

        console.log(error.message);

        mostrarMensagem("❌ " + error.message, "erro");

    return;

}


// CRIAR PERFIL

const { error: profileError } = await window.supabaseClient
.from("profiles")
.insert({

    id: data.user.id,
    nome: nome,
    plano: "teste",
    status: "ativo",
    inicio_teste: new Date().toISOString()

});


if (profileError) {

    console.log(profileError.message);

    mostrarMensagem(
        "❌ Erro ao criar perfil.",
        "erro"
    );

    return;

}




// ================================
// LOGIN
// ================================

async function login() {


    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;



    if (!email || !senha) {

        mostrarMensagem("⚠️ Digite o e-mail e a senha.", "erro");

        return;

    }



    const { data, error } = await window.supabaseClient.auth.signInWithPassword({

        email: email,

        password: senha

    });



    if (error) {


        console.log(error.message);

        mostrarMensagem("❌ E-mail ou senha incorretos.", "erro");

        return;


    }



    console.log("Login realizado:", data.user.email);


    window.location.href = "dashboard.html";


}




// ================================
// SAIR
// ================================

async function logout() {


    const { error } = await window.supabaseClient.auth.signOut();



    if (error) {


        console.log(error.message);

        mostrarMensagem("❌ Não foi possível sair da conta.", "erro");

        return;


    }



    window.location.href = "login.html";


}




// ================================
// USUARIO ATUAL
// ================================

async function usuarioAtual() {


    const { data } = await window.supabaseClient.auth.getSession();


    if (data.session) {

        return data.session.user;

    }


    return null;


}
