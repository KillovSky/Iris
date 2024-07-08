-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS personal (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Deleta as colunas invalidas
DELETE FROM personal WHERE id NOT LIKE '%@s.whatsapp.net%';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM personal WHERE julianday('now') - julianday(modified) > 30;

-- Define os valores finais na WITH para formatar
WITH response(format) AS (
    -- Obtém varias objects JSON
    SELECT json_group_object(id, json(data))

    -- Seleciona dos JSON's retornados
    FROM (
        -- Pelo valor especificado
        SELECT id, data

        -- Da table 'personal'
        FROM personal

        -- Organizado em decrescente
        ORDER BY json_extract(data, '$.{INSERTKEY}') DESC

        -- Com limite de 'x'
        LIMIT {INSERTMATHSYM}
    )
)

-- Seleciona como JSON a resposta
SELECT json(format) FROM response;