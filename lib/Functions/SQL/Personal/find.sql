-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS personal (
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Deleta as colunas invalidas
DELETE FROM personal WHERE id NOT LIKE '%@s.whatsapp.net%';

-- Adquire os grupos com x função ativa
SELECT json_group_object(id, json(data)) FROM personal

-- Onde o valor da key seja igual ou maior que 'x'
WHERE json_extract(data, '$.{INSERTKEY}') {INSERTMATHSYM} {INSERTJSON};