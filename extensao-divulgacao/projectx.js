console.log("✅ Extensão Divulgação conectada ao Projeto X");


// ======================================
// VERIFICAR CONTEXTO DA EXTENSÃO
// ======================================

function extensaoEstaAtiva() {

    try {

        return Boolean(
            chrome &&
            chrome.runtime &&
            chrome.runtime.id &&
            chrome.storage &&
            chrome.storage.local
        );

    } catch {

        return false;

    }
}


// ======================================
// SALVAR NO STORAGE COM SEGURANÇA
// ======================================

function salvarStorage(
    dados,
    callback
) {

    if (!extensaoEstaAtiva()) {

        console.warn(
            "⚠️ Contexto da extensão indisponível."
        );

        return;
    }


    try {

        chrome.storage.local.set(
            dados,
            () => {

                try {

                    if (
                        chrome.runtime.lastError
                    ) {

                        console.warn(
                            "Projeto X:",
                            chrome.runtime.lastError.message
                        );

                        return;
                    }


                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback();

                    }

                } catch (erro) {

                    console.warn(
                        "⚠️ Extensão atualizada durante a operação.",
                        erro
                    );

                }

            }
        );

    } catch (erro) {

        console.warn(
            "⚠️ Erro ao salvar dados da extensão:",
            erro
        );

    }
}


// ======================================
// LER STORAGE COM SEGURANÇA
// ======================================

function lerStorage(
    chaves,
    callback
) {

    if (!extensaoEstaAtiva()) {

        console.warn(
            "⚠️ Contexto da extensão indisponível."
        );

        return;
    }


    try {

        chrome.storage.local.get(
            chaves,
            resultado => {

                try {

                    if (
                        chrome.runtime.lastError
                    ) {

                        console.warn(
                            "Projeto X:",
                            chrome.runtime.lastError.message
                        );

                        return;
                    }


                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback(
                            resultado || {}
                        );

                    }

                } catch (erro) {

                    console.warn(
                        "⚠️ Extensão atualizada durante a leitura.",
                        erro
                    );

                }

            }
        );

    } catch (erro) {

        console.warn(
            "⚠️ Erro ao ler dados da extensão:",
            erro
        );

    }
}


// ======================================
// ENVIAR RESPOSTA AO PROJETO X
// ======================================

function enviarParaProjetoX(
    type,
    dados = {}
) {

    window.postMessage(
        {

            source:
                "PROJETOX_EXTENSION",

            type,

            ...dados

        },
        "*"
    );

}


// ======================================
// EVENTOS DO PROJETO X
// ======================================

window.addEventListener(
    "message",
    event => {

        if (
            event.source !==
            window
        ) {

            return;
        }


        if (
            event.data?.source !==
            "PROJETOX_APP"
        ) {

            return;
        }


        const tipo =
            event.data?.type;


// ======================================
// ABRIR BUSCA NO FACEBOOK
// ======================================

        if (
            tipo ===
            "PESQUISAR_GRUPOS_FACEBOOK"
        ) {

            const termo =
                String(
                    event.data?.termo ||
                    ""
                )
                    .trim();


            if (!termo) {

                return;

            }


            salvarStorage(
                {

                    buscaGruposProjetoX:
                        termo,

                    gruposEncontrados:
                        []

                },
                () => {

                    const url =
                        "https://www.facebook.com/search/groups?q=" +
                        encodeURIComponent(
                            termo
                        );


                    window.open(
                        url,
                        "_blank"
                    );

                }
            );


            return;
        }


// ======================================
// DEVOLVER RESULTADOS AO PROJETO X
// ======================================

        if (
            tipo ===
            "CARREGAR_GRUPOS_CAPTURADOS"
        ) {

            lerStorage(
                [

                    "gruposEncontrados",
                    "termoBuscaGrupos",
                    "dataCapturaGrupos",
                    "filtroGrupos"

                ],
                resultado => {

                    enviarParaProjetoX(
                        "GRUPOS_CAPTURADOS",
                        {

                            termo:
                                resultado
                                    .termoBuscaGrupos ||
                                "",

                            grupos:
                                resultado
                                    .gruposEncontrados ||
                                [],

                            filtro:
                                resultado
                                    .filtroGrupos ||
                                null,

                            dataCaptura:
                                resultado
                                    .dataCapturaGrupos ||
                                null

                        }
                    );

                }
            );


            return;
        }


// ======================================
// PREPARAR CAMPANHA
// ======================================

        if (
            tipo ===
            "PREPARAR_CAMPANHA_DIVULGACAO"
        ) {

            const campanhaId =
                String(
                    event.data
                        ?.campanhaId ||
                    ""
                )
                    .trim();


            const intervaloMinutos =
                Number(
                    event.data
                        ?.intervaloMinutos ||
                    5
                );


            if (!campanhaId) {

                console.warn(
                    "⚠️ Campanha sem ID."
                );

                return;
            }


            const campanha =
                {

                    campanhaId,

                    status:
                        "em_andamento",

                    intervaloMinutos:
                        intervaloMinutos > 0
                            ? intervaloMinutos
                            : 5,

                    criadoEm:
                        new Date()
                            .toISOString(),

                    atualizadoEm:
                        new Date()
                            .toISOString()

                };


            salvarStorage(
                {

                    campanhaDivulgacao:
                        campanha

                },
                () => {

                    console.log(
                        "🚀 Campanha preparada na extensão:",
                        campanha
                    );


                    enviarParaProjetoX(
                        "CAMPANHA_DIVULGACAO_PREPARADA",
                        campanha
                    );

                }
            );


            return;
        }


// ======================================
// PAUSAR CAMPANHA
// ======================================

        if (
            tipo ===
            "PAUSAR_CAMPANHA_DIVULGACAO"
        ) {

            atualizarEstadoCampanha(
                event.data?.campanhaId,
                "pausada"
            );


            return;
        }


// ======================================
// CONTINUAR CAMPANHA
// ======================================

        if (
            tipo ===
            "CONTINUAR_CAMPANHA_DIVULGACAO"
        ) {

            atualizarEstadoCampanha(
                event.data?.campanhaId,
                "em_andamento"
            );


            return;
        }


// ======================================
// PARAR CAMPANHA
// ======================================

        if (
            tipo ===
            "PARAR_CAMPANHA_DIVULGACAO"
        ) {

            atualizarEstadoCampanha(
                event.data?.campanhaId,
                "parada"
            );


            return;
        }

    }
);


// ======================================
// ATUALIZAR ESTADO DA CAMPANHA
// ======================================

function atualizarEstadoCampanha(
    campanhaId,
    novoStatus
) {

    const id =
        String(
            campanhaId ||
            ""
        )
            .trim();


    if (!id) {

        return;
    }


    lerStorage(
        [
            "campanhaDivulgacao"
        ],
        resultado => {

            const atual =
                resultado
                    .campanhaDivulgacao;


            if (
                !atual ||
                atual.campanhaId !== id
            ) {

                console.warn(
                    "⚠️ Campanha não encontrada na extensão:",
                    id
                );

                return;
            }


            const atualizado =
                {

                    ...atual,

                    status:
                        novoStatus,

                    atualizadoEm:
                        new Date()
                            .toISOString()

                };


            salvarStorage(
                {

                    campanhaDivulgacao:
                        atualizado

                },
                () => {

                    console.log(
                        "🔄 Estado da campanha atualizado:",
                        atualizado
                    );


                    enviarParaProjetoX(
                        "ESTADO_CAMPANHA_DIVULGACAO",
                        atualizado
                    );

                }
            );

        }
    );
}


console.log(
    "✅ projectx.js pronto para busca e controle de campanha."
);
