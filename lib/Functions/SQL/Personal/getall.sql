-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS personal (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO personal (id, data) VALUES ('{INSERTUSER}', '{INSERTDEFAULT}');

-- Deleta as colunas invalidas
DELETE FROM personal WHERE id NOT LIKE '%@s.whatsapp.net%';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM personal WHERE julianday('now') - julianday(modified) > 30;

-- Adquire os dados do usuário
SELECT json_group_object(id, json(data))

-- Da table
FROM personal