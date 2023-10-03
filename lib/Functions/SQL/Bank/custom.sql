-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS banks (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO banks (id, data) VALUES ('{INSERTUSER}', '{INSERTDEFAULT}');

-- Deleta as colunas invalidas
DELETE FROM banks WHERE id NOT LIKE '%@c.us%';

-- Comando customizado de SQL
{INSERTKEY};