-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS groups (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO groups (id, data) VALUES ('{INSERTGROUP}', '{INSERTDEFAULT}');

-- Comando customizado de SQL
{INSERTKEY};