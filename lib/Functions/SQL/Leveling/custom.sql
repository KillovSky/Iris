-- Se não existir, cria a table e modelo de DB
CREATE TABLE IF NOT EXISTS leveling (
    id INTEGER PRIMARY KEY,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(user, chat) ON CONFLICT IGNORE
);

-- Insere os valores ou ignora, caso existam
INSERT OR IGNORE INTO leveling (created, modified, user, chat, data) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '{INSERTUSER}', '{INSERTGROUP}', '{INSERTDEFAULT}');

-- Atualiza o JSON
UPDATE leveling SET data = json_patch('{INSERTDEFAULT}', data), modified = CURRENT_TIMESTAMP WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';

-- Deleta as colunas invalidas
DELETE FROM leveling WHERE user NOT LIKE '%@s.whatsapp.net%' OR chat NOT LIKE '%@g.us%';

-- Deleta as colunas com modified superior a 30 dias do tempo atual
DELETE FROM leveling WHERE julianday('now') - julianday(modified) > 30;

-- Comando customizado de SQL
{INSERTKEY};