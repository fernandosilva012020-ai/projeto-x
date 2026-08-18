console.log("✅ Extensão Divulgação conectada ao Projeto X");

window.addEventListener("message", event => {

    if (event.source !== window) return;

    if (
        event.data?.source !== "PROJETOX_APP" ||
        event.data?.type !== "PESQUISAR_GRUPOS_FACEBOOK"
    ) {
        return;
    }

    const termo =
        String(event.data?.termo || "").trim();

    if (!termo) return;

    chrome.storage.local.set({
        buscaGruposProjetoX: termo,
        gruposEncontrados: []
    });

    const url =
        "https://www.facebook.com/search/groups?q=" +
        encodeURIComponent(termo);

    window.open(url, "_blank");
});
