async function cadastrar() {

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
