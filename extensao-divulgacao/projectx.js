console.log("✅ Extensão Divulgação conectada ao Projeto X");

window.addEventListener("message", event => {

    if (event.source !== window) return;

    if (
        event.data?.source !== "PROJETOX_APP" ||
        event.data?.type !== "BUSCAR_GRUPOS_CAPTURADOS"
    ) {
        return;
    }

    chrome.storage.local.get(
        ["gruposEncontrados"],
        resultado => {

            window.postMessage(
                {
                    source: "PROJETOX_EXTENSION",
                    type: "GRUPOS_CAPTURADOS",
                    grupos: resultado.gruposEncontrados || []
                },
                "*"
            );

        }
    );

});
