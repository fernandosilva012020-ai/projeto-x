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
                        ⚡ Auto SBC
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

                </div>

            </div>
        `;

        document.body.appendChild(sidebar);

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
