-- Se não existir, cria a tabela e modelo de DB
CREATE TABLE IF NOT EXISTS banks (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO banks (id, data, created, modified) VALUES ('{INSERTUSER}', '{INSERTDEFAULT}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Atualiza o JSON
UPDATE banks SET data = json_patch('{INSERTDEFAULT}', data), modified = CURRENT_TIMESTAMP WHERE id = '{INSERTUSER}';

-- Deleta as colunas invalidas
DELETE FROM banks WHERE id NOT LIKE '%@s.whatsapp.net%';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM banks WHERE julianday('now') - julianday(modified) > 30;

-- Adquire os dados do usuário
SELECT json(data) FROM banks WHERE id = '{INSERTUSER}';