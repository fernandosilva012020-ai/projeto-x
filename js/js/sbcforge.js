console.log("SBCForge carregado");


async function criarSbc() {


    const nome = document.getElementById("nomeSbc").value;

    const requisitos = document.getElementById("requisitosSbc").value;


    if (!nome) {

        alert("Digite o nome do SBC");

        return;

    }


    const { data } = await window.supabaseClient.auth.getSession();


    if (!data.session) {

        alert("Usuário não conectado");

        return;

    }


    const user = data.session.user;



    const { error } = await window.supabaseClient
        .from("sbcs")
        .insert({

            user_id: user.id,

            nome: nome,

            requisitos: requisitos

        });



    if (error) {

        console.log(error);

        alert("Erro ao criar SBC");

        return;

    }



    alert("SBC criado com sucesso!");



    document.getElementById("nomeSbc").value = "";

    document.getElementById("requisitosSbc").value = "";


}
