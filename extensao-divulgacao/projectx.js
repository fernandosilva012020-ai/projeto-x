console.log("✅ Extensão Divulgação conectada ao Projeto X");

window.addEventListener("message", event => {

    if (event.source !== window) return;

    // ======================================
    // ABRIR BUSCA NO FACEBOOK
    // ======================================

    if (
        event.data?.source === "PROJETOX_APP" &&
        event.data?.type === "PESQUISAR_GRUPOS_FACEBOOK"
    ) {

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

        return;
    }


    // ======================================
    // DEVOLVER RESULTADOS AO PROJETO X
    // ======================================

    if (
        event.data?.source === "PROJETOX_APP" &&
        event.data?.type === "CARREGAR_GRUPOS_CAPTURADOS"
    ) {

        chrome.storage.local.get(
            [
                "gruposEncontrados",
                "termoBuscaGrupos",
                "dataCapturaGrupos"
            ],
            resultado => {

                window.postMessage(
                    {
                        source: "PROJETOX_EXTENSION",
                        type: "GRUPOS_CAPTURADOS",

                        termo:
                            resultado.termoBuscaGrupos || "",

                        grupos:
                            resultado.gruposEncontrados || [],

                        dataCaptura:
                            resultado.dataCapturaGrupos || null
                    },
                    "*"
                );

            }
        );
    }

});
