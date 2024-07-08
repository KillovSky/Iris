-- Se não existir, cria a tabela e modelo de DB original, assim não dará erro
CREATE TABLE IF NOT EXISTS personal (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);
-- Cria uma nova tabela temporária com a estrutura desejada
CREATE TABLE IF NOT EXISTS new_personal (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Copia os dados da tabela antiga para a nova tabela
INSERT INTO new_personal (id, data)
SELECT id, data FROM personal;

-- Renomeia a tabela antiga para backup
ALTER TABLE personal RENAME TO old_personal;

-- Renomeia a nova tabela para o nome da tabela original
ALTER TABLE new_personal RENAME TO personal;

-- Deleta a tabela antiga
DROP TABLE IF EXISTS old_personal;