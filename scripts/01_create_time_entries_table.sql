-- Tabela para armazenar os registros de entrada/saída
-- Execute este script após configurar o Supabase

CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  total_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhorar performance nas consultas por data
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date DESC);

-- RLS (Row Level Security) - ajuste conforme necessário
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (ajuste conforme sua necessidade)
CREATE POLICY "Enable all operations for authenticated users" ON time_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);
