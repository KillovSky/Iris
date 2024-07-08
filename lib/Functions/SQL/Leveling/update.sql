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

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO leveling (created, modified, user, chat, data) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '{INSERTUSER}', '{INSERTGROUP}', '{INSERTDEFAULT}');

-- Atualiza o JSON
UPDATE leveling SET data = json_patch('{INSERTDEFAULT}', data) WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';

-- Atualiza e seta a data, local do JSON
UPDATE leveling SET data = (
    -- Declara a string JSON como uma variável
    WITH my_json(received) AS (VALUES ('{INSERTJSON}'))

    -- Seleciona o grupo JSON presente na DB se a key existir
    SELECT json_group_object(key, value + COALESCE(json_extract(my_json.received, '$.' || key), 0))

    -- JSON enviado pelo Node.js
    FROM json_each(data), my_json
), modified = CURRENT_TIMESTAMP

-- Somente onde a user e chat sejam os requisitados e se o JSON da table for válido
WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}' AND json_valid(data); 

-- Deleta as colunas invalidas
DELETE FROM leveling WHERE user NOT LIKE '%@s.whatsapp.net%' OR chat NOT LIKE '%@g.us%';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM leveling WHERE julianday('now') - julianday(modified) > 30;

-- Exibe o json final
SELECT data FROM leveling WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';