-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS leveling (
    id INTEGER PRIMARY KEY,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(user, chat) ON CONFLICT IGNORE
);

-- Remove a ID
DELETE FROM leveling WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';

-- Deleta as colunas invalidas
DELETE FROM leveling WHERE user NOT LIKE '%@c.us%' OR chat NOT LIKE '%@g.us%';

-- Adquire o padrão só pra ter algo pra usar
SELECT json('{INSERTDEFAULT}');