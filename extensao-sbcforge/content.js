console.log("SBCForge carregado no FC Web App");

// ======================================
// PAINEL PEQUENO
// ======================================

if (!document.getElementById("sbcforge-extension")) {

    const painel = document.createElement("div");

    painel.id = "sbcforge-extension";

    painel.innerHTML = `
        <div style="
            position:fixed;
            top:20px;
            right:20px;
            width:280px;
            z-index:9999999;
            background:#111827;
            color:white;
            padding:16px;
            border-radius:12px;
            font-family:Arial,sans-serif;
            box-shadow:0 8px 30px rgba(0,0,0,.45);
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:12px;
            ">
                <strong>⚽ SBCForge</strong>

                <button id="sbcforge-fechar" style="
                    background:transparent;
                    border:none;
                    color:white;
                    cursor:pointer;
                    font-size:18px;
                ">
                    ✕
                </button>
            </div>

            <div id="sbcforge-mini-status" style="
                font-size:13px;
                margin-bottom:12px;
                color:#cbd5e1;
            ">
                🟢 FC Web App conectado
            </div>

            <button id="sbcforge-abrir" style="
                width:100%;
                padding:11px;
                border:none;
                border-radius:8px;
                cursor:pointer;
                font-weight:bold;
                background:#1e293b;
                color:white;
            ">
                Abrir painel
            </button>

        </div>
    `;

    document.body.appendChild(painel);
}


// ======================================
// FECHAR PAINEL PEQUENO
// ======================================

document
    .getElementById("sbcforge-fechar")
    ?.addEventListener("click", () => {

        document
            .getElementById("sbcforge-extension")
            ?.remove();

    });


// ======================================
// ABRIR PAINEL PREMIUM
// ======================================

document
    .getElementById("sbcforge-abrir")
    ?.addEventListener("click", () => {

        if (document.getElementById("sbcforge-sidebar")) {
            return;
        }

        const sidebar = document.createElement("div");

        sidebar.id = "sbcforge-sidebar";

        sidebar.innerHTML = `
            <div style="
                position:fixed;
                top:0;
                right:0;
                width:360px;
                height:100vh;
                z-index:9999999;
                background:#0f172a;
                color:white;
                font-family:Arial,sans-serif;
                box-shadow:-8px 0 30px rgba(0,0,0,.45);
                display:flex;
                flex-direction:column;
            ">

                <div style="
                    padding:18px;
                    background:#111827;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                    <div>
                        <strong style="font-size:18px;">
                            ⚽ SBCForge
                        </strong>

                        <div style="
                            font-size:12px;
                            color:#94a3b8;
                            margin-top:4px;
                        ">
                            Painel Premium
                        </div>
                    </div>

                    <button id="sbcforge-sidebar-fechar" style="
                        background:transparent;
                        border:none;
                        color:white;
                        font-size:22px;
                        cursor:pointer;
                    ">
                        ✕
                    </button>

                </div>

                <div style="
                    padding:18px;
                    overflow-y:auto;
                    flex:1;
                ">

                    <div id="sbcforge-status" style="
                        background:#1e293b;
                        padding:14px;
                        border-radius:10px;
                        margin-bottom:14px;
                        color:white;
                    ">
                        🟢 FC Web App conectado
                    </div>

                    <button id="sbcforge-auto-sbc" style="
    width:100%;
    padding:12px;
    margin-bottom:10px;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
    color:white;
    background:#1e293b;
">
    ⚡ Analisar SBC
</button>

<div id="sbcforge-analise" style="
    display:none;
    background:#111827;
    padding:12px;
    border-radius:8px;
    margin-bottom:12px;
    font-size:13px;
    line-height:1.5;
    color:white;
"></div>

                    <button id="sbcforge-ler-elenco" style="
    width:100%;
    padding:12px;
    margin-bottom:10px;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
    color:white;
    background:#1e293b;
">
    👥 Meu Clube
</button>

<button style="
    width:100%;
    padding:12px;
    margin-bottom:10px;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
    color:white;
    background:#1e293b;
">
    🧩 SBCs
</button>

                    <button style="
                        width:100%;
                        padding:12px;
                        border:none;
                        border-radius:8px;
                        cursor:pointer;
                        font-weight:bold;
                        color:white;
                        background:#1e293b;
                    ">
                        ⚙️ Configurações
                    </button>

                    <button id="sbcforge-mapear" style="
    width:100%;
    padding:12px;
    margin-top:10px;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
    color:white;
    background:#1e293b;
">
    🔍 Mapear tela
</button>

<div id="sbcforge-mapeamento" style="
    display:none;
    background:#111827;
    padding:12px;
    border-radius:8px;
    margin-top:10px;
    font-size:12px;
    color:white;
    max-height:300px;
    overflow:auto;
"></div>

<button id="sbcforge-selecionar-elemento" style="
    width:100%;
    padding:12px;
    margin-top:10px;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
    color:white;
    background:#1e293b;
">
    🎯 Selecionar jogador/slot
</button>
                </div>

            </div>
        `;

        document.body.appendChild(sidebar);

        const botaoMeuClube =
    sidebar.querySelector("#sbcforge-ler-elenco");

botaoMeuClube?.addEventListener("click", event => {

    event.preventDefault();
    event.stopPropagation();

    lerElencoSBC();

});
        document
            .getElementById("sbcforge-sidebar-fechar")
            ?.addEventListener("click", () => {

                sidebar.remove();

            });

        detectarAreaSBC();

    });


// ======================================
// DETECTOR DA ÁREA DE SBC
// ======================================

function detectarAreaSBC() {

    const url = window.location.href.toLowerCase();

    const textoPagina =
        (document.body?.innerText || "").toLowerCase();

    const estaNoSBC =
        url.includes("sbc") ||
        textoPagina.includes("squad building challenges") ||
        textoPagina.includes("desafios de montagem de elenco");

    const status =
        document.getElementById("sbcforge-status");

    const miniStatus =
        document.getElementById("sbcforge-mini-status");

    if (estaNoSBC) {

        if (status) {
            status.innerHTML = `
                🧩 <strong>Área de SBC detectada</strong>
                <div style="
                    font-size:12px;
                    color:#94a3b8;
                    margin-top:5px;
                ">
                    SBCForge pronto para analisar
                </div>
            `;
        }

        if (miniStatus) {
            miniStatus.innerHTML =
                "🧩 Área de SBC detectada";
        }

    } else {

        if (status) {
            status.innerHTML = `
                🟢 <strong>FC Web App conectado</strong>
                <div style="
                    font-size:12px;
                    color:#94a3b8;
                    margin-top:5px;
                ">
                    Entre em um SBC para continuar
                </div>
            `;
        }

        if (miniStatus) {
            miniStatus.innerHTML =
                "🟢 FC Web App conectado";
        }
    }
}


// Verifica mudanças dentro do Web App
setInterval(detectarAreaSBC, 1500);

detectarAreaSBC();

// ======================================
// IDENTIFICAR SBC ABERTO
// ======================================

function identificarSBCAberto() {

    const elementos = document.querySelectorAll(
        "h1, h2, h3, [role='heading']"
    );

    let nomeSBC = "";

    for (const elemento of elementos) {

        const texto =
            (elemento.innerText || "")
            .trim();

        if (
            texto.length >= 4 &&
            texto.length <= 100
        ) {
            nomeSBC = texto;
            break;
        }
    }

    if (!nomeSBC) {
        return;
    }

    const status =
        document.getElementById("sbcforge-status");

    if (status) {

        status.innerHTML = `
            🧩 <strong>SBC detectado</strong>

            <div style="
                margin-top:7px;
                color:white;
            ">
                ${nomeSBC}
            </div>

            <div style="
                font-size:12px;
                color:#94a3b8;
                margin-top:5px;
            ">
                Preparando análise do desafio...
            </div>
        `;
    }

    console.log(
        "⚽ SBCForge - possível SBC aberto:",
        nomeSBC
    );
}


// Verifica o SBC aberto
setInterval(() => {

    const status =
        document.getElementById("sbcforge-status");

    if (
        status &&
        (
            document.body.innerText
                .toLowerCase()
                .includes("squad building") ||

            document.body.innerText
                .toLowerCase()
                .includes("desafios de montagem")
        )
    ) {
        identificarSBCAberto();
    }

}, 2000);

// ======================================
// ANALISAR REQUISITOS VISÍVEIS DO SBC
// ======================================

function analisarRequisitosSBC() {

    const areaResultado =
        document.getElementById("sbcforge-analise");

    if (!areaResultado) return;

    const linhas =
        (document.body?.innerText || "")
        .split(/\n+/)
        .map(linha => linha.trim())
        .filter(Boolean);

    const requisitos = {
        overall: [],
        quimica: [],
        jogadores: [],
        liga: [],
        clube: [],
        nacionalidade: [],
        raridade: [],
        outros: []
    };

    linhas.forEach(linha => {

        const texto = linha.toLowerCase();

        if (
            texto.includes("overall") ||
            texto.includes("classificação") ||
            texto.includes("rating")
        ) {
            requisitos.overall.push(linha);
        }

        else if (
            texto.includes("química") ||
            texto.includes("chemistry")
        ) {
            requisitos.quimica.push(linha);
        }

        else if (
            texto.includes("jogadores") ||
            texto.includes("players")
        ) {
            requisitos.jogadores.push(linha);
        }

        else if (
            texto.includes("liga") ||
            texto.includes("league")
        ) {
            requisitos.liga.push(linha);
        }

        else if (
            texto.includes("clube") ||
            texto.includes("club")
        ) {
            requisitos.clube.push(linha);
        }

        else if (
            texto.includes("nacionalidade") ||
            texto.includes("nation") ||
            texto.includes("country")
        ) {
            requisitos.nacionalidade.push(linha);
        }

        else if (
            texto.includes("raridade") ||
            texto.includes("rare")
        ) {
            requisitos.raridade.push(linha);
        }
    });

    function mostrar(lista) {

        if (!lista.length) {
            return `<span style="color:#64748b;">Não identificado</span>`;
        }

        return lista
            .slice(0, 4)
            .map(item => `• ${item}`)
            .join("<br>");
    }

    areaResultado.style.display = "block";

    areaResultado.innerHTML = `

        <strong>🔎 Análise do SBC</strong>

        <div style="margin-top:12px;">
            <strong>⭐ Overall</strong><br>
            ${mostrar(requisitos.overall)}
        </div>

        <div style="margin-top:10px;">
            <strong>🧪 Química</strong><br>
            ${mostrar(requisitos.quimica)}
        </div>

        <div style="margin-top:10px;">
            <strong>👥 Jogadores</strong><br>
            ${mostrar(requisitos.jogadores)}
        </div>

        <div style="margin-top:10px;">
            <strong>🏆 Liga</strong><br>
            ${mostrar(requisitos.liga)}
        </div>

        <div style="margin-top:10px;">
            <strong>🛡️ Clube</strong><br>
            ${mostrar(requisitos.clube)}
        </div>

        <div style="margin-top:10px;">
            <strong>🌎 Nacionalidade</strong><br>
            ${mostrar(requisitos.nacionalidade)}
        </div>

        <div style="margin-top:10px;">
            <strong>✨ Raridade</strong><br>
            ${mostrar(requisitos.raridade)}
        </div>
    `;

    console.log(
        "⚽ SBCForge - requisitos organizados:",
        requisitos
    );
}


// Botão funciona mesmo sendo criado depois
document.addEventListener("click", event => {

    if (
        event.target.closest("#sbcforge-auto-sbc")
    ) {

        analisarRequisitosSBC();

    }

});

// ======================================
// MAPEAR ELEMENTOS DO FC WEB APP
// ======================================

function mapearTelaFC() {

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (!resultado) return;

    const elementos = Array.from(
    document.querySelectorAll(
        "h1, h2, h3, button, [role='button'], img, [class*='player'], [class*='card'], [class*='item']"
    )
).filter(elemento => {

    return !elemento.closest("#sbcforge-extension") &&
           !elemento.closest("#sbcforge-sidebar");

});

    const encontrados = [];

    elementos.forEach(elemento => {

        const texto =
            (elemento.innerText ||
             elemento.getAttribute("alt") ||
             elemento.getAttribute("title") ||
             "")
            .trim()
            .replace(/\s+/g, " ");

        const classe =
            typeof elemento.className === "string"
                ? elemento.className
                : "";

        if (!texto && !classe) return;

        encontrados.push({
            tag: elemento.tagName,
            texto: texto.substring(0, 80),
            classe: classe.substring(0, 120)
        });

    });

    const unicos =
        encontrados
        .filter((item, indice, lista) =>
            indice === lista.findIndex(outro =>
                outro.tag === item.tag &&
                outro.texto === item.texto &&
                outro.classe === item.classe
            )
        )
        .slice(0, 50);

    resultado.style.display = "block";

    resultado.innerHTML = `
        <strong>🔍 Elementos encontrados: ${unicos.length}</strong>
        <div style="margin-top:10px;">
            ${
                unicos.map(item => `
                    <div style="
                        border-bottom:1px solid #334155;
                        padding:7px 0;
                    ">
                        <strong>${item.tag}</strong><br>
                        ${item.texto || "(sem texto)"}<br>
                        <span style="color:#94a3b8;">
                            ${item.classe || "(sem classe)"}
                        </span>
                    </div>
                `).join("")
            }
        </div>
    `;

    console.log(
        "⚽ SBCForge - mapeamento:",
        unicos
    );
}


document.addEventListener("click", event => {

    if (event.target.closest("#sbcforge-mapear")) {
        mapearTelaFC();
    }

});
// ======================================
// SELETOR DE ELEMENTO DO FC
// ======================================

let sbcforgeModoSelecao = false;

document.addEventListener("click", event => {

    if (event.target.closest("#sbcforge-selecionar-elemento")) {

        sbcforgeModoSelecao = true;

        const resultado =
            document.getElementById("sbcforge-mapeamento");

        if (resultado) {
            resultado.style.display = "block";
            resultado.innerHTML = `
                🎯 <strong>Modo seleção ativado</strong><br><br>
                Clique em um jogador ou slot do elenco.
            `;
        }

        return;
    }

}, true);


document.addEventListener("click", event => {

    if (!sbcforgeModoSelecao) return;

    if (
        event.target.closest("#sbcforge-extension") ||
        event.target.closest("#sbcforge-sidebar")
    ) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    sbcforgeModoSelecao = false;

    const alvo = event.target;

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (!resultado) return;

    let elemento = alvo;
    const caminho = [];

    for (let i = 0; i < 6 && elemento; i++) {

        caminho.push({
            tag: elemento.tagName,
            classe:
                typeof elemento.className === "string"
                    ? elemento.className
                    : "",
            id: elemento.id || "",
            texto:
                (elemento.innerText || "")
                .trim()
                .replace(/\s+/g, " ")
                .substring(0, 100)
        });

        elemento = elemento.parentElement;
    }

    resultado.style.display = "block";

    resultado.innerHTML = `
        <strong>🎯 Elemento capturado</strong>

        ${caminho.map((item, indice) => `
            <div style="
                padding:8px 0;
                border-bottom:1px solid #334155;
            ">
                <strong>Nível ${indice}</strong><br>
                TAG: ${item.tag}<br>
                ID: ${item.id || "(sem id)"}<br>
                CLASSE: ${item.classe || "(sem classe)"}<br>
                TEXTO: ${item.texto || "(sem texto)"}
            </div>
        `).join("")}
    `;

    console.log(
        "⚽ SBCForge - elemento selecionado:",
        caminho
    );

}, true);
// ======================================
// LER SLOTS DO ELENCO
// ======================================

function lerElencoSBC() {

    const slots = document.querySelectorAll(
        ".ut-squad-pitch-view .ut-squad-slot-view"
    );

    const dados = [];

    slots.forEach((slot, indice) => {

        const jogador =
            slot.querySelector(".player.item");

        const vazio =
            !jogador ||
            jogador.classList.contains("empty");

        const textoSlot =
            (slot.innerText || "")
            .trim()
            .replace(/\s+/g, " ");

        dados.push({
            slot: indice + 1,
            vazio,
            texto: textoSlot || "Sem texto",
            classeJogador: jogador?.className || ""
        });

    });

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (!resultado) return;

    resultado.style.display = "block";

    resultado.innerHTML = `
        <strong>👥 Elenco detectado</strong>

        <div style="margin-top:8px;">
            Slots encontrados: ${dados.length}
        </div>

        <div style="margin-top:10px;">

            ${dados.map(item => `

                <div style="
                    padding:8px 0;
                    border-bottom:1px solid #334155;
                ">

                    <strong>
                        Slot ${item.slot}
                        ${item.vazio ? "⬜ Vazio" : "✅ Jogador"}
                    </strong>

                    ${
                        !item.vazio
                        ? `
                            <div style="margin-top:5px;">
                                TEXTO: ${item.texto}<br>
                                CLASSE: ${item.classeJogador}
                            </div>
                        `
                        : ""
                    }

                </div>

            `).join("")}

        </div>
    `;

    console.log(
        "⚽ SBCForge - jogadores do elenco:",
        dados
    );

    inspecionarJogadorCarregado();
}


// ======================================
// INSPECIONAR JOGADOR CARREGADO
// ======================================

function inspecionarJogadorCarregado() {

    const jogador = document.querySelector(
        ".ut-squad-pitch-view .ut-squad-slot-view .ut-item-loaded"
    );

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (!jogador || !resultado) return;

    const elementos = [
        jogador,
        ...jogador.querySelectorAll("*")
    ];

    const dados = [];

    elementos.forEach(el => {

        const src =
            el.getAttribute?.("src") || "";

        const href =
            el.getAttribute?.("href") || "";

        const style =
            el.getAttribute?.("style") || "";

        const background =
            window.getComputedStyle(el).backgroundImage || "";

        const atributosData =
            Array.from(el.attributes || [])
            .filter(attr =>
                attr.name.startsWith("data-")
            )
            .map(attr =>
                `${attr.name}="${attr.value}"`
            )
            .join(" | ");

        if (
            src ||
            href ||
            style ||
            atributosData ||
            (
                background &&
                background !== "none"
            )
        ) {

            dados.push({
                tag: el.tagName,
                classe:
                    typeof el.className === "string"
                        ? el.className
                        : "",
                src,
                href,
                style,
                background,
                data: atributosData
            });

        }

    });

    resultado.style.display = "block";

    resultado.innerHTML = `
        <strong>🧬 Recursos do jogador</strong>

        <div style="margin-top:10px;">

            ${
                dados.length
                ? dados.map(item => `

                    <div style="
                        padding:8px 0;
                        border-bottom:1px solid #334155;
                        word-break:break-all;
                    ">

                        <strong>${item.tag}</strong><br>

                        CLASSE:
                        ${item.classe || "(vazio)"}
                        <br>

                        SRC:
                        ${item.src || "(vazio)"}
                        <br>

                        DATA:
                        ${item.data || "(vazio)"}
                        <br>

                        BACKGROUND:
                        ${item.background || "(vazio)"}

                    </div>

                `).join("")

                : "Nenhum recurso encontrado."
            }

        </div>
    `;

    console.log(
        "⚽ SBCForge - recursos jogador:",
        dados
    );
}

function lerElencoSBC() {

    const slots = document.querySelectorAll(
        ".ut-squad-pitch-view .ut-squad-slot-view"
    );

    const dados = [];

    slots.forEach((slot, indice) => {

        const jogador = slot.querySelector(".player.item");

        const vazio =
            !jogador ||
            jogador.classList.contains("empty");

        const textoSlot =
            (slot.innerText || "")
                .trim()
                .replace(/\s+/g, " ");

        const imagem = slot.querySelector("img");

        dados.push({
            slot: indice + 1,
            vazio: vazio,
            texto: textoSlot || "Sem texto",
            imagemAlt: imagem?.getAttribute("alt") || "",
            imagemTitle: imagem?.getAttribute("title") || "",
            classeJogador: jogador?.className || ""
        });

    });

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (!resultado) return;

    resultado.style.display = "block";

    resultado.innerHTML = `
        <strong>👥 Elenco detectado</strong>

        <div style="margin-top:8px;">
            Slots encontrados: ${dados.length}
        </div>

        <div style="margin-top:10px;">
            ${dados.map(item => `
                <div style="
                    padding:8px 0;
                    border-bottom:1px solid #334155;
                ">
                    <strong>
                        Slot ${item.slot}
                        ${item.vazio ? "⬜ Vazio" : "✅ Jogador"}
                    </strong>

                    ${!item.vazio ? `
                        <div style="margin-top:5px;">
                            TEXTO: ${item.texto}<br>
                            ALT: ${item.imagemAlt || "(vazio)"}<br>
                            TITLE: ${item.imagemTitle || "(vazio)"}<br>
                            CLASSE: ${item.classeJogador || "(vazio)"}
                        </div>
                    ` : ""}
                </div>
            `).join("")}
        </div>
    `;

    console.log(
        "⚽ SBCForge - jogadores do elenco:",
        dados
    );
    inspecionarJogadorCarregado();
}

    const slots =
    document.querySelectorAll(
        ".ut-squad-pitch-view .ut-squad-slot-view"
    );

    const dados = [];

    slots.forEach((slot, indice) => {

        const jogador =
            slot.querySelector(".player.item");

        const vazio =
            !jogador ||
            jogador.classList.contains("empty");

        const posicao =
            (slot.innerText || "")
            .trim()
            .split("\n")[0];

        dados.push({
            slot: indice + 1,
            posicao: posicao || "Não identificada",
            vazio: vazio
        });
    });

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (resultado) {

        resultado.style.display = "block";

        resultado.innerHTML = `
            <strong>👥 Elenco detectado</strong>

            <div style="margin-top:10px;">
                Slots encontrados: ${dados.length}
            </div>

            <div style="margin-top:10px;">
                ${
                    dados.map(item => `
                        <div style="
                            padding:6px 0;
                            border-bottom:1px solid #334155;
                        ">
                            ${item.slot}. ${item.posicao}
                            — ${item.vazio ? "⬜ Vazio" : "✅ Jogador"}
                        </div>
                    `).join("")
                }
            </div>
        `;
    }

    console.log(
        "⚽ SBCForge - elenco:",
        dados
    );

// ======================================
// INSPECIONAR JOGADOR CARREGADO
// ======================================

function inspecionarJogadorCarregado() {

    const jogador = document.querySelector(
        ".ut-squad-pitch-view .ut-squad-slot-view .ut-item-loaded"
    );

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (!jogador || !resultado) return;

    const elementos = [
        jogador,
        ...jogador.querySelectorAll("*")
    ];

    const dados = [];

    elementos.forEach(el => {

        const src =
            el.getAttribute?.("src") || "";

        const href =
            el.getAttribute?.("href") || "";

        const style =
            el.getAttribute?.("style") || "";

        const background =
            window.getComputedStyle(el).backgroundImage || "";

        const atributosData = Array.from(el.attributes || [])
            .filter(attr => attr.name.startsWith("data-"))
            .map(attr => `${attr.name}="${attr.value}"`)
            .join(" | ");

        if (
            src ||
            href ||
            style ||
            atributosData ||
            (background && background !== "none")
        ) {

            dados.push({
                tag: el.tagName,
                classe:
                    typeof el.className === "string"
                        ? el.className
                        : "",
                src,
                href,
                style,
                background,
                data: atributosData
            });
        }

    });

    resultado.style.display = "block";

    resultado.innerHTML = `
        <strong>🧬 Recursos do jogador</strong>

        ${
            dados.length
            ? dados.map(item => `
                <div style="
                    padding:8px 0;
                    border-bottom:1px solid #334155;
                    word-break:break-all;
                ">
                    <strong>${item.tag}</strong><br>
                    CLASSE: ${item.classe || "(vazio)"}<br>
                    SRC: ${item.src || "(vazio)"}<br>
                    DATA: ${item.data || "(vazio)"}<br>
                    BACKGROUND: ${item.background || "(vazio)"}
                </div>
            `).join("")
            : "Nenhum recurso encontrado."
        }
    `;
}

    const jogador =
        document.querySelector(
            ".ut-squad-pitch-view .ut-squad-slot-view .ut-item-loaded"
        );

    const resultado =
        document.getElementById("sbcforge-mapeamento");

    if (!jogador || !resultado) return;

    const elementos = [
        jogador,
        ...jogador.querySelectorAll("*")
    ];

    const dados = [];

    elementos.forEach(el => {

        const texto =
            (el.innerText || "")
            .trim()
            .replace(/\s+/g, " ");

        const classe =
            typeof el.className === "string"
                ? el.className
                : "";

        const alt = el.getAttribute("alt") || "";
        const title = el.getAttribute("title") || "";

        if (
            texto ||
            classe ||
            alt ||
            title
        ) {

            const atributos = Array.from(el.attributes || [])
    .map(attr => `${attr.name}="${attr.value}"`)
    .join(" | ");

dados.push({
    tag: el.tagName,
    texto: texto.substring(0, 100),
    classe: classe.substring(0, 150),
    alt,
    title,
    atributos: atributos.substring(0, 500)
});
        }

    });

    resultado.style.display = "block";

    resultado.innerHTML = `
        <strong>🔎 Dados internos do jogador</strong>

        ${dados.map(item => `
            <div style="
                padding:8px 0;
                border-bottom:1px solid #334155;
            ">
                <strong>${item.tag}</strong><br>
                TEXTO: ${item.texto || "(vazio)"}<br>
                ALT: ${item.alt || "(vazio)"}<br>
                TITLE: ${item.title || "(vazio)"}<br>
                CLASSE: ${item.classe || "(vazio)"}
                <br>
ATRIBUTOS: ${item.atributos || "(vazio)"}
            </div>
        `).join("")}
    `;

    console.log(
        "⚽ SBCForge - detalhes jogador:",
        dados
    );
}
