// =================================
// Projeto X - Configuração Supabase
// =================================

const SUPABASE_URL = "https://jddgebxqwmxngfitcftb.supabase.co";
const SUPABASE_KEY = "sb_publishable_Cjh1IP0PWmozDUm8gH7jMQ_bpQ1u6tu";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Config carregada");
