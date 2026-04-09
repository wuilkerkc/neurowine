-- Esse script criará a tabela "attendees" corretamente para receber nossas inscrições.
-- Por favor, copie todo o conteúdo abaixo e cole na tela "SQL EDITOR" do Supabase e clique em "RUN".

CREATE TABLE public.attendees (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    nome text not null,
    categoria text not null,
    especialidade text,
    cidade text,
    email text,
    whatsapp text,
    valor numeric not null default 0
);

-- Ativa o RLS mas nós vamos criar regras base para o seu frontend operar sem bloquear Inserções
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;

-- Permite que qualquer pessoa insira dados (O formulário frontend)
CREATE POLICY "Enable insert for everyone" ON public.attendees
    FOR INSERT WITH CHECK (true);

-- Permite que o frontend (dashboard anon) acesse os dados dos inscritos
CREATE POLICY "Enable select for everyone" ON public.attendees
    FOR SELECT USING (true);
