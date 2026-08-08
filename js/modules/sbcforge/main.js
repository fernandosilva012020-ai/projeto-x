// =================================
// Projeto X - SBCForge Module
// Carrega o SBCForge verdadeiro
// =================================

window.ProjetoX = window.ProjetoX || {};

ProjetoX.SBCForge = {

    async abrir() {

        const area = document.getElementById("app-view");

        if (!area) return;

        // Esconde o conteúdo normal do Dashboard
        [...area.parentElement.children].forEach((elemento) => {
            if (elemento !== area) {
                elemento.style.display = "none";
            }
        });

        area.style.display = "block";
        area.innerHTML = "<p>Carregando SBCForge...</p>";

        // Carrega o CSS verdadeiro do SBCForge
        if (!document.getElementById("css-sbcforge")) {

            const css = document.createElement("link");

            css.id = "css-sbcforge";
            css.rel = "stylesheet";
            css.href = "css/sbcforge.css";

            document.head.appendChild(css);
        }

        // Busca a página SBCForge verdadeira
        const resposta = await fetch("sbcforge.html");

        const html = await resposta.text();

        const documento = new DOMParser()
            .parseFromString(html, "text/html");

        const conteudo = documento.querySelector("main.content");

        if (!conteudo) {
            area.innerHTML = "<h2>Erro ao carregar SBCForge</h2>";
            return;
        }

        area.innerHTML = conteudo.innerHTML;

        if (typeof iniciarSBCForge === "function") {
    iniciarSBCForge();
}

        // Marcar SBCForge como menu ativo
document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.classList.remove("active");
});

document.getElementById("sbcforge")?.classList.add("active");

    }

};