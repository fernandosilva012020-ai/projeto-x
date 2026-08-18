const botoesMenu = document.querySelectorAll(".divulgacao-menu button");
const conteudoDinamico =
    document.getElementById("divulgacao-conteudo-dinamico");

const cardsVisaoGeral =
    document.querySelector(".cards");

const areasVisaoGeral =
    document.querySelectorAll(".area");


function esconderVisaoGeral() {

    if (cardsVisaoGeral) {
        cardsVisaoGeral.style.display = "none";
    }

    areasVisaoGeral.forEach(area => {
        area.style.display = "none";
    });
}


function mostrarVisaoGeral() {

    if (cardsVisaoGeral) {
        cardsVisaoGeral.style.display = "";
    }

    areasVisaoGeral.forEach(area => {
        area.style.display = "";
    });

    conteudoDinamico.style.display = "none";
    conteudoDinamico.innerHTML = "";
}


function abrirPostarGrupos() {

    esconderVisaoGeral();

    conteudoDinamico.style.display = "block";

    conteudoDinamico.innerHTML = `
        <section class="area">

            <h2>📢 Postar em Grupos</h2>

            <p>
                Crie uma publicação e escolha os grupos onde deseja divulgar.
            </p>

            <textarea
                style="
                    width:100%;
                    min-height:160px;
                    padding:14px;
                    margin-top:15px;
                    border:1px solid #cbd5e1;
                    border-radius:10px;
                    box-sizing:border-box;
                    resize:vertical;
                "
                placeholder="Digite o texto da publicação..."
            ></textarea>

        </section>
    `;
}


botoesMenu.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesMenu.forEach(item => {
            item.classList.remove("active");
        });

        botao.classList.add("active");

        const view = botao.dataset.view;

        if (view === "visao-geral") {
            mostrarVisaoGeral();
        }

        if (view === "postar-grupos") {
            abrirPostarGrupos();
        }

    });

});
