-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS groups (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Deleta as colunas invalidas
DELETE FROM groups WHERE id NOT LIKE '%@g.us%';

-- Adquire os grupos com x função ativa
SELECT json_group_object(id, json(data)) FROM groups

-- Onde o valor da key seja igual a 'x'
WHERE json_extract(data, '$.{INSERTKEY}') {INSERTMATHSYM} {INSERTJSON};