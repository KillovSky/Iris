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

-- Atualiza e seta a data, local do JSON
UPDATE leveling SET data = (
    -- Declara a string JSON como uma variável
    WITH my_json(received) AS (VALUES ('{INSERTJSON}'))

    -- Seleciona o grupo JSON presente na DB se a key existir
    SELECT json_group_object(key, value + COALESCE(json_extract(my_json.received, '$.' || key), 0))

    -- JSON enviado pelo Node.js
    FROM json_each(data), my_json
)

-- Somente onde a user e chat sejam os requisitados e se o JSON da table for válido
WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}' AND json_valid(data); 

-- Deleta as colunas invalidas
DELETE FROM leveling WHERE user NOT LIKE '%@c.us%' OR chat NOT LIKE '%@g.us%';

-- Exibe o json final
SELECT data FROM leveling WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';