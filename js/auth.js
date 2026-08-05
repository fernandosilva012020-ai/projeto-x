// ===============================
// AUTH - Projeto X
// Login / Cadastro / Logout
// ===============================


// CADASTRO

async function cadastrarUsuario(nome, email, senha) {


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

        alert(error.message);

        return false;

    }



    alert("Conta criada com sucesso! Agora faça o login.");

    return true;


}





// LOGIN

async function login() {


    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;



    if (!email || !senha) {

        alert("Digite email e senha");

        return;

    }



    const { data, error } = await window.supabaseClient.auth.signInWithPassword({

        email: email,

        password: senha

    });



    if (error) {

        console.log(error.message);

        alert("Erro no login: " + error.message);

        return;

    }



    window.location.href = "dashboard.html";


}



    const { data, error } = await window.supabaseClient.auth.signInWithPassword({

        email: email,

        password: senha

    });



    if (error) {

        console.log(error.message);

        alert("Erro no login: " + error.message);

        return;

    }



    window.location.href = "dashboard.html";


}



    window.location.href = "dashboard.html";


}





// LOGOUT

async function logout() {

    const { error } = await window.supabaseClient.auth.signOut();

    if(error){

        console.log(error.message);

        return;

    }

    window.location.href = "login.html";

}



// VERIFICAR USUÁRIO LOGADO

async function usuarioAtual(){


    const { data } = await window.supabaseClient.auth.getSession();


    if(data.session){


        return data.session.user;


    }


    return null;


}
