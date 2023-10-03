-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS leveling (
    id INTEGER PRIMARY KEY,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL
);

-- Deleta as colunas invalidas
DELETE FROM leveling WHERE user NOT LIKE '%@c.us%' OR chat NOT LIKE '%@g.us%';

-- Define os valores finais na WITH para formatar
WITH response(format) AS (
    -- Obtém varias objects JSON
    SELECT json_object(user, json_object('from', chat, 'values', json(data))) as json_value

    -- Seleciona dos JSON's retornados
    FROM (
        -- Pelo valor especificado
        SELECT user, chat, data

        -- Da table 'leveling'
        FROM leveling

        -- Onde a chat é igual (ou global)
        {INSERTKEY}

        -- Organizado em decrescente
        ORDER BY json_extract(data, '$.{INSERTVALUE}') DESC

        -- Com limite de 'x'
        LIMIT {INSERTMATHSYM}
    )
)

-- Transforma as respostas em uma array de objects JSON
SELECT json_group_array(json(format)) FROM response;