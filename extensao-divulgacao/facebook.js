console.log("✅ Projeto X Divulgação carregado no Facebook");


// ======================================
// CRIAR BOTÃO
// ======================================

if (!document.getElementById("projetox-capturar-grupos")) {

    const botao = document.createElement("button");

    botao.id = "projetox-capturar-grupos";
    botao.textContent = "🔎 Capturar grupos";

    botao.style.cssText = `
        position:fixed;
        right:20px;
        bottom:20px;
        z-index:99999999;
        background:#111827;
        color:#ffffff;
        border:none;
        border-radius:10px;
        padding:13px 17px;
        font-size:14px;
        font-weight:bold;
        cursor:pointer;
        box-shadow:0 8px 25px rgba(0,0,0,.35);
    `;

    document.body.appendChild(botao);
}


// ======================================
// CAPTURAR GRUPOS VISÍVEIS
// ======================================

function capturarGruposFacebook() {

    const links =
        document.querySelectorAll(
            'a[href*="/groups/"]'
        );

    const grupos = [];

    links.forEach(link => {

        let nome =
            (link.innerText || "")
            .trim()
            .replace(/\s+/g, " ");

        let url =
            link.href || "";

        if (!nome || !url) {
            return;
        }

        // Ignorar links internos que não são grupos
        if (
            url.includes("/groups/feed") ||
            url.includes("/groups/discover")
        ) {
            return;
        }

        try {

            const endereco =
                new URL(url);

            endereco.search = "";
            endereco.hash = "";

            url =
                endereco.toString();

        } catch {
            return;
        }


        const repetido =
            grupos.some(
                grupo =>
                    grupo.url === url
            );

        if (repetido) {
            return;
        }


        grupos.push({
            nome,
            url
        });

    });


    chrome.storage.local.set(
        {
            gruposEncontrados: grupos
        },
        () => {

            alert(
                `✅ ${grupos.length} grupo(s) encontrado(s).`
            );

            console.log(
                "👥 Projeto X - grupos encontrados:",
                grupos
            );

        }
    );
}


// ======================================
// CLIQUE
// ======================================

document
    .getElementById("projetox-capturar-grupos")
    ?.addEventListener(
        "click",
        capturarGruposFacebook
    );
