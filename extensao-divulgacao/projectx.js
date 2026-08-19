console.log("✅ Extensão Divulgação conectada ao Projeto X");


// ======================================
// CHAVES
// ======================================

const CHAVE_CAMPANHA =
    "campanhaDivulgacao";

const CHAVE_PUBLICACAO_ATUAL =
    "publicacaoProjetoXAtual";

const CHAVE_RESULTADO_PUBLICACAO =
    "resultadoPublicacaoProjetoX";


// ======================================
// VERIFICAR EXTENSÃO
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
// SALVAR STORAGE
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
                            chrome.runtime
                                .lastError
                                .message
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
            "⚠️ Erro ao salvar no storage:",
            erro
        );

    }
}


// ======================================
// LER STORAGE
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
                            chrome.runtime
                                .lastError
                                .message
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
            "⚠️ Erro ao ler storage:",
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
// ABRIR GRUPO NO FACEBOOK
// ======================================

function abrirGrupoFacebook(
    grupoUrl
) {

    try {

        const url =
            new URL(
                grupoUrl
            );


        const hostValido =
            [
                "facebook.com",
                "www.facebook.com"
            ].includes(
                url.hostname
                    .toLowerCase()
            );


        const caminhoValido =
            url.pathname
                .startsWith(
                    "/groups/"
                );


        if (
            !hostValido ||
            !caminhoValido
        ) {

            console.warn(
                "⚠️ URL de grupo inválida:",
                grupoUrl
            );


            enviarParaProjetoX(
                "ERRO_PREPARAR_PUBLICACAO",
                {

                    mensagem:
                        "A URL recebida não é de um grupo válido do Facebook."

                }
            );


            return;

        }


        const aba =
            window.open(
                url.href,
                "_blank"
            );


        if (!aba) {

            /*
                Se o navegador bloquear a nova aba,
                abre o grupo na própria aba.
            */

            window.location.href =
                url.href;

        }


    } catch (erro) {

        console.warn(
            "⚠️ Não foi possível abrir o grupo:",
            erro
        );


        enviarParaProjetoX(
            "ERRO_PREPARAR_PUBLICACAO",
            {

                mensagem:
                    "Não foi possível abrir o grupo do Facebook."

            }
        );

    }

}


// ======================================
// PREPARAR PUBLICAÇÃO DO FACEBOOK
// ======================================

function prepararPublicacaoFacebook(
    dados
) {

    const campanhaId =
        String(
            dados?.campanhaId ||
            ""
        ).trim();


    const groupId =
        String(
            dados?.groupId ||
            ""
        ).trim();


    const grupoUrl =
        String(
            dados?.grupoUrl ||
            ""
        ).trim();


    const grupoNome =
        String(
            dados?.grupoNome ||
            "Grupo selecionado"
        ).trim();


    const texto =
        String(
            dados?.texto ||
            ""
        ).trim();


    if (
        !campanhaId ||
        !groupId ||
        !grupoUrl ||
        !texto
    ) {

        console.warn(
            "⚠️ Publicação incompleta recebida:",
            dados
        );

        enviarParaProjetoX(
            "ERRO_PREPARAR_PUBLICACAO",
            {

                mensagem:
                    "Dados da publicação incompletos."

            }
        );

        return;
    }


    const agora =
        new Date()
            .toISOString();


    const tarefa =
        {

            campanhaId,

            groupId,

            grupoNome,

            grupoUrl,

            texto,

            status:
                "aguardando_usuario",

            criadoEm:
                agora,

            atualizadoEm:
                agora

        };


    salvarStorage(
        {

            [CHAVE_PUBLICACAO_ATUAL]:
                tarefa,

            [CHAVE_RESULTADO_PUBLICACAO]:
                null

        },
        () => {

            console.log(
                "👥 Primeira publicação preparada:",
                tarefa
            );


            enviarParaProjetoX(
                "PUBLICACAO_FACEBOOK_PREPARADA",
                {

                    campanhaId,

                    groupId,

                    grupoNome,

                    grupoUrl

                }
            );


            abrirGrupoFacebook(
                grupoUrl
            );

        }
    );
}


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
        ).trim();


    if (!id) {

        return;
    }


    lerStorage(
        [
            CHAVE_CAMPANHA
        ],
        resultado => {

            const atual =
                resultado[
                    CHAVE_CAMPANHA
                ];


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

                    [CHAVE_CAMPANHA]:
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


// ======================================
// RECEBER MENSAGENS DO PROJETO X
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
// BUSCAR GRUPOS
// ======================================

        if (
            tipo ===
            "PESQUISAR_GRUPOS_FACEBOOK"
        ) {

            const termo =
                String(
                    event.data?.termo ||
                    ""
                ).trim();


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
// CARREGAR GRUPOS CAPTURADOS
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
                ).trim();


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

                    [CHAVE_CAMPANHA]:
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


            if (
                event.data
                    ?.publicacao
            ) {

                prepararPublicacaoFacebook(
                    {

                        campanhaId,

                        ...event.data
                            .publicacao

                    }
                );

            }


            return;
        }


// ======================================
// RECEBER PRIMEIRA PUBLICAÇÃO
// ======================================

        if (
            tipo ===
            "PREPARAR_PUBLICACAO_FACEBOOK"
        ) {

            prepararPublicacaoFacebook(
                event.data
            );


            return;
        }


// ======================================
// PAUSAR
// ======================================

        if (
            tipo ===
            "PAUSAR_CAMPANHA_DIVULGACAO"
        ) {

            atualizarEstadoCampanha(
                event.data
                    ?.campanhaId,

                "pausada"
            );


            return;
        }


// ======================================
// CONTINUAR
// ======================================

        if (
            tipo ===
            "CONTINUAR_CAMPANHA_DIVULGACAO"
        ) {

            atualizarEstadoCampanha(
                event.data
                    ?.campanhaId,

                "em_andamento"
            );


            return;
        }


// ======================================
// PARAR
// ======================================

        if (
            tipo ===
            "PARAR_CAMPANHA_DIVULGACAO"
        ) {

            atualizarEstadoCampanha(
                event.data
                    ?.campanhaId,

                "parada"
            );


            salvarStorage(
                {

                    [CHAVE_PUBLICACAO_ATUAL]:
                        null

                }
            );


            return;
        }

    }
);


// ======================================
// RECEBER RESULTADO DO FACEBOOK
// ======================================

try {

    chrome.storage.onChanged
        .addListener(
            (
                changes,
                areaName
            ) => {

                if (
                    areaName !==
                    "local"
                ) {

                    return;
                }


                const mudanca =
                    changes[
                        CHAVE_RESULTADO_PUBLICACAO
                    ];


                if (
                    !mudanca ||
                    !mudanca.newValue
                ) {

                    return;
                }


                const resultado =
                    mudanca.newValue;


                console.log(
                    "✅ Resultado recebido do Facebook:",
                    resultado
                );


                enviarParaProjetoX(
                    "RESULTADO_PUBLICACAO_FACEBOOK",
                    resultado
                );

            }
        );

} catch (erro) {

    console.warn(
        "⚠️ Não foi possível acompanhar resultados:",
        erro
    );
}


console.log(
    "✅ projectx.js pronto para campanha e publicação."
);
