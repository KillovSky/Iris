-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS personal (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO personal (id, data) VALUES ('{INSERTUSER}', '{INSERTDEFAULT}');

-- Remove a Object
UPDATE personal SET data = json_remove(data, '$.{INSERTKEY}{INSERTJSON}') WHERE id = '{INSERTUSER}';

-- Deleta as colunas invalidas
DELETE FROM personal WHERE id NOT LIKE '%@s.whatsapp.net%';

-- Adquire os dados do usuário
SELECT data FROM personal WHERE id = '{INSERTUSER}';