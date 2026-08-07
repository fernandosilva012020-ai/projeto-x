// =================================
// Projeto X - Configuração Supabase
// =================================

const SUPABASE_URL = "https://jddgebxqwmxngfitcftb.supabase.co";
const SUPABASE_KEY = "SUA_CHAVE_PUBLICAVEL";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Config carregada");
