-- Se não existir, cria a tabela e modelo de DB original, assim não dará erro
CREATE TABLE IF NOT EXISTS leveling (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id INTEGER PRIMARY KEY,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(user, chat) ON CONFLICT IGNORE
);

-- Cria uma nova tabela temporária com a estrutura desejada
CREATE TABLE IF NOT EXISTS new_leveling (
    id INTEGER PRIMARY KEY,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(user, chat) ON CONFLICT IGNORE
);

-- Copia os dados da tabela antiga para a nova tabela
INSERT INTO new_leveling (id, user, chat, data)
SELECT id, user, chat, data FROM leveling;

-- Renomeia a tabela antiga para backup
ALTER TABLE leveling RENAME TO old_leveling;

-- Renomeia a nova tabela para o nome da tabela original
ALTER TABLE new_leveling RENAME TO leveling;

-- Deleta a tabela antiga
DROP TABLE IF EXISTS old_leveling;