-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS banks (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO banks (id, data) VALUES ('{INSERTUSER}', '{INSERTDEFAULT}');

-- Atualiza o JSON
UPDATE banks SET data = json_patch('{INSERTDEFAULT}', data) WHERE id = '{INSERTUSER}';

-- Remove a Object
UPDATE banks SET data = json_remove(data, '$.{INSERTKEY}{INSERTJSON}') WHERE id = '{INSERTUSER}';

-- Deleta as colunas invalidas
DELETE FROM banks WHERE id NOT LIKE '%@s.whatsapp.net%';

-- Adquire os dados do grupo
SELECT data FROM banks WHERE id = '{INSERTUSER}';