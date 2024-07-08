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

-- Atualiza o JSON
UPDATE personal SET data = json_patch('{INSERTDEFAULT}', data), modified = CURRENT_TIMESTAMP WHERE id = '{INSERTUSER}';

-- Atualiza a coluna 'data' da tabela 'personal' com os valores do JSON recebido
UPDATE personal SET data = (
    -- Declara a string JSON como uma variável
    WITH my_json(received) AS (VALUES ('{INSERTJSON}'))

    -- Seleciona o grupo JSON presente na tabela 'personal' se a chave existir
    SELECT json_group_object(key,
        -- Sistema de case
        CASE
            -- Se a chave existir na tabela e no JSON e for true
            WHEN json_quote(json_extract(my_json.received, '$.' || key)) IN (1, 'true', '1') THEN (
                json_patch(json_extract(data, '$.' || key), 'true')
            )

            -- Se a chave existir na tabela e no JSON e for false
            WHEN json_quote(json_extract(my_json.received, '$.' || key)) IN (0, 'false', '0') THEN (
                json_patch(json_extract(data, '$.' || key), 'false')
            )

            -- Se a chave é um objeto, atualiza os valores
            WHEN json_type(json_quote(json_extract(my_json.received, '$.' || key))) = 'object' THEN (
                json_patch(json_extract(data, '$.' || key), json_extract(my_json.received, '$.' || key))
            )

            -- Se for texto
            WHEN json_type(json_quote(json_extract(my_json.received, '$.' || key))) = 'text' THEN (
                json_quote(json_extract(my_json.received, '$.' || key))
            )

            -- Se a key é uma array, combina as arrays sem duplicar valores
            WHEN json_type(json_quote(json_extract(my_json.received, '$.' || key))) = 'array' THEN (

                -- Array presente na tabela
                WITH array1 AS (SELECT json_extract(data, '$.' || key) AS arr FROM personal),

                -- Segunda array recebida
                array2 AS (SELECT json_extract(my_json.received, '$.' || key) AS arr)

                -- Atualiza a array sem inserir duplicados
                SELECT json_group_array(DISTINCT value) FROM (

                    -- Seleciona a array 1
                    SELECT value FROM array1, json_each(array1.arr)

                    -- E une
                    UNION

                    -- Com a array 2
                    SELECT value FROM array2, json_each(array2.arr)
                )
            )

            -- Se a chave existir na tabela e no JSON, insere o valor dela
            WHEN json_quote(json_extract(my_json.received, '$.' || key)) NOT IN (null, '') THEN (
                json_extract(my_json.received, '$.' || key)
            )

            -- Padrão, caso seja false
            WHEN value IN (0, 'false', '0') THEN (
                json_patch(json_extract(data, '$.' || key), 'false')
            )

            -- Mesma coisa, mas com true
            WHEN value IN (1, 'true', '1') THEN (
                json_patch(json_extract(data, '$.' || key), 'true')
            )

            -- Repete o existente
            ELSE value

            -- Finaliza a case
        END
    )

    -- Roda o each usando os valores em JSON da data, enviando o JSON recebido também
    FROM json_each(data), my_json
)

-- Somente onde a group seja a especificada e se o JSON da table for válido
WHERE id = '{INSERTUSER}' AND json_valid(data); 

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM personal WHERE julianday('now') - julianday(modified) > 30;

-- Exibe o json final
SELECT data FROM personal WHERE id = '{INSERTUSER}';