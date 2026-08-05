async function cadastrar() {

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;


    const { data, error } = await supabaseClient.auth.signUp({
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
