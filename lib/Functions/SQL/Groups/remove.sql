-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS groups (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Remove a ID
DELETE FROM groups WHERE id = '{INSERTGROUP}';

-- Adquire o padrão só pra ter algo pra usar
SELECT json('{INSERTDEFAULT}');