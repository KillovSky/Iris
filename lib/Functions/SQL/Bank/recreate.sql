-- Se não existir, cria a tabela e modelo de DB original, assim não dará erro
CREATE TABLE IF NOT EXISTS banks (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Cria uma nova tabela temporária com a estrutura desejada
CREATE TABLE IF NOT EXISTS new_banks (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Copia os dados da tabela antiga para a nova tabela
INSERT INTO new_banks (id, data)
SELECT id, data FROM banks;

-- Renomeia a tabela antiga para backup
ALTER TABLE banks RENAME TO old_banks;

-- Renomeia a nova tabela para o nome da tabela original
ALTER TABLE new_banks RENAME TO banks;

-- Deleta a tabela antiga
DROP TABLE IF EXISTS old_banks;