-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS groups (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO groups (created, modified, id, data) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '{INSERTGROUP}', '{INSERTDEFAULT}');

-- Atualiza o JSON
UPDATE groups SET data = json_patch('{INSERTDEFAULT}', data), modified = CURRENT_TIMESTAMP WHERE id = '{INSERTGROUP}';

-- Remove a Object
UPDATE groups SET data = json_remove(data, '$.{INSERTKEY}{INSERTJSON}') WHERE id = '{INSERTGROUP}';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM groups WHERE julianday('now') - julianday(modified) > 30;

-- Adquire os dados do grupo
SELECT data FROM groups WHERE id = '{INSERTGROUP}';