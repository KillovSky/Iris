-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS banks (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Remove a ID
DELETE FROM banks WHERE id = '{INSERTUSER}';

-- Deleta as colunas invalidas
DELETE FROM banks WHERE id NOT LIKE '%@c.us%';

-- Adquire o padrão só pra ter algo pra usar
SELECT json('{INSERTDEFAULT}');