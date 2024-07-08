-- Se não existir, cria a tabela e modelo de DB original, assim não dará erro
CREATE TABLE IF NOT EXISTS groups (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Cria uma nova tabela temporária com a estrutura desejada
CREATE TABLE IF NOT EXISTS new_groups (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Copia os dados da tabela antiga para a nova tabela
INSERT INTO new_groups (id, data)
SELECT id, data FROM groups;

-- Renomeia a tabela antiga para backup
ALTER TABLE groups RENAME TO old_groups;

-- Renomeia a nova tabela para o nome da tabela original
ALTER TABLE new_groups RENAME TO groups;

-- Deleta a tabela antiga
DROP TABLE IF EXISTS old_groups;