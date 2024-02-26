-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS leveling (
    id INTEGER PRIMARY KEY,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(user, chat) ON CONFLICT IGNORE
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO leveling (user, chat, data) VALUES ('{INSERTUSER}', '{INSERTGROUP}', '{INSERTDEFAULT}');

-- Atualiza o JSON
UPDATE leveling SET data = json_patch('{INSERTDEFAULT}', data) WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';

-- Remove a Object
UPDATE leveling SET data = json_remove(data, '$.{INSERTKEY}{INSERTJSON}') WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';

-- Deleta as colunas invalidas
DELETE FROM leveling WHERE user NOT LIKE '%@s.whatsapp.net%' OR chat NOT LIKE '%@g.us%';

-- Adquire os dados do grupo
SELECT data FROM leveling WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';