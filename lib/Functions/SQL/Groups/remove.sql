-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS groups (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Remove a ID
DELETE FROM groups WHERE id = '{INSERTGROUP}';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM groups WHERE julianday('now') - julianday(modified) > 30;

-- Adquire o padrão só pra ter algo pra usar
SELECT json('{INSERTDEFAULT}');