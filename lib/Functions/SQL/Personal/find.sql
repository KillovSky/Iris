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

-- Adquire os grupos com x função ativa
SELECT json_group_object(id, json(data)) FROM personal

-- Onde o valor da key seja igual ou maior que 'x'
WHERE json_extract(data, '$.{INSERTKEY}') {INSERTMATHSYM} {INSERTJSON};