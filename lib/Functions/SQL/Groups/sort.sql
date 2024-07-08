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

-- Adquire os grupos com x função ativa
SELECT json_group_object(id, json(data)) FROM groups

-- Onde o valor da key seja...
WHERE json_extract(data, '$.{INSERTKEY}') IN (
    -- ...Determinado via case que...
    CASE 
        -- ...Se for um False, usa o valor 0
        WHEN '{INSERTGROUP}' IN (0, 'false', '0') THEN (
            0
        )

        -- ...Se for um True, usa o valor 1
        WHEN '{INSERTGROUP}' IN (1, 'true', '1') THEN (
            1
        )

        -- ...Se for outro tipo, usa direto
        ELSE '{INSERTGROUP}'

        -- Finaliza a case
    END
)

-- Com limite de 'x'
LIMIT {INSERTMATHSYM};