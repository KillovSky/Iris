-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS groups (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Deleta as colunas invalidas
DELETE FROM groups WHERE id NOT LIKE '%@g.us%';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM groups WHERE julianday('now') - julianday(modified) > 30;

-- Adquire os dados do usuário
SELECT json_group_array(json_object(id, json(data)))

-- Da table
FROM groups;