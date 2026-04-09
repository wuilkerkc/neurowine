// Configuração Central do Supabase

// A URL foi fornecida por você no chat
const SUPABASE_URL = 'https://ikmyrqzpcbfilbtxbclr.supabase.co';

// ATENÇÃO: Substitua a string abaixo pela sua "anon public key"
// que pode ser encontrada em: Project Settings -> API no painel do Supabase.
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

// Inicializa o cliente Supabase apenas se a chave não for a string de placeholder
let supabase;
if (SUPABASE_ANON_KEY !== 'SUA_ANON_KEY_AQUI') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn("⚠️ Supabase Anon Key não configurada! O banco de dados não funcionará até que você a insira em supabase-config.js");
}
