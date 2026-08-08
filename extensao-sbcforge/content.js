console.log("SBCForge carregado no FC Web App");

const painel = document.createElement("div");

painel.id = "sbcforge-extension";

painel.innerHTML = `
    <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        background: #111827;
        color: white;
        padding: 14px 18px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        box-shadow: 0 8px 30px rgba(0,0,0,.35);
    ">
        ⚽ SBCForge ativo
    </div>
`;

document.body.appendChild(painel);
