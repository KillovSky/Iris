-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS leveling (
    id INTEGER PRIMARY KEY,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(user, chat) ON CONFLICT IGNORE
);

-- Deleta as colunas invalidas
DELETE FROM leveling WHERE user NOT LIKE '%@s.whatsapp.net%' OR chat NOT LIKE '%@g.us%';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM leveling WHERE julianday('now') - julianday(modified) > 30;

-- Adquire os dados do usuário
SELECT json_group_array(json_object(user, json_object('from', chat, 'values', json(data))))

-- Da table
FROM leveling;