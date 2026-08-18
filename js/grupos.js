const listaGrupos =
    document.getElementById("listaGrupos");

const totalGrupos =
    document.getElementById("totalGrupos");

const totalAtivos =
    document.getElementById("totalAtivos");


// ======================================
// CARREGAR GRUPOS
// ======================================

async function carregarGrupos() {

    const { data: sessao } =
        await window.supabaseClient.auth.getSession();

    const usuario =
        sessao?.session?.user;

    if (!usuario) return;


    const { data: grupos, error } =
        await window.supabaseClient
            .from("grupos")
            .select("*")
            .eq("user_id", usuario.id)
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(error);

        listaGrupos.innerHTML =
            "Erro ao carregar grupos.";

        return;
    }


    totalGrupos.textContent =
        grupos.length;

    totalAtivos.textContent =
        grupos.filter(
            grupo => grupo.status === "ativo"
        ).length;


    if (!grupos.length) {

        listaGrupos.innerHTML =
            "Nenhum grupo cadastrado ainda.";

        return;
    }


    listaGrupos.innerHTML =
        grupos.map(grupo => `

            <div style="
                padding:14px;
                border:1px solid #e2e8f0;
                border-radius:10px;
                margin-bottom:10px;
            ">

                <strong>
                    👥 ${grupo.name}
                </strong>

                <div style="
                    margin-top:5px;
                    color:#64748b;
                    font-size:13px;
                ">
                    ${grupo.url || ""}
                </div>

            </div>

        `).join("");
}


// ======================================
// ADICIONAR GRUPO
// ======================================

document
    .getElementById("adicionarGrupo")
    ?.addEventListener("click", async event => {

        event.preventDefault();


        const nome =
            prompt("Nome do grupo:");

        if (!nome) return;


        const url =
            prompt("Link do grupo do Facebook:");

        if (!url) return;


        const { data: sessao } =
            await window.supabaseClient.auth.getSession();

        const usuario =
            sessao?.session?.user;

        if (!usuario) {

            alert("Usuário não conectado.");

            return;
        }


        const { error } =
            await window.supabaseClient
                .from("grupos")
                .insert({
                    user_id: usuario.id,
                    name: nome.trim(),
                    url: url.trim(),
                    status: "ativo"
                });


        if (error) {

            console.error(error);

            alert(
                "Erro ao cadastrar grupo: " +
                error.message
            );

            return;
        }


        alert("✅ Grupo cadastrado!");

        carregarGrupos();

    });


carregarGrupos();
