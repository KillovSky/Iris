-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS personal (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Remove a ID
DELETE FROM personal WHERE id = '{INSERTUSER}';

-- Deleta as colunas invalidas
DELETE FROM personal WHERE id NOT LIKE '%@s.whatsapp.net%';

-- Adquire o padrão só pra ter algo pra usar
SELECT json('{INSERTDEFAULT}');