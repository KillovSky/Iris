-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS banks (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO banks (id, data) VALUES ('{INSERTUSER}', '{INSERTDEFAULT}');

-- Atualiza e seta a data, local do JSON
UPDATE banks SET data = (
    -- Declara a string JSON como uma variável
    WITH my_json(received) AS (VALUES ('{INSERTJSON}'))

    -- Seleciona o grupo JSON presente na DB se a key existir
    SELECT json_group_object(key, value + COALESCE(json_extract(my_json.received, '$.' || key), 0))

    -- JSON enviado pelo Node.js
    FROM json_each(data), my_json
)

-- Somente onde a id seja a requisitada e se o JSON da table for válido
WHERE id = '{INSERTUSER}' AND json_valid(data); 

-- Deleta as colunas invalidas
DELETE FROM banks WHERE id NOT LIKE '%@c.us%';

-- Exibe o json final
SELECT data FROM banks WHERE id = '{INSERTUSER}';