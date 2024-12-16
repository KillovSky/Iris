-- Cria a tabela banks
CREATE TABLE IF NOT EXISTS banks (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Cria a tabela groups
CREATE TABLE IF NOT EXISTS groups (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Cria a tabela leveling
CREATE TABLE IF NOT EXISTS leveling (
    id INTEGER PRIMARY KEY,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL,
    chat TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(user, chat) ON CONFLICT IGNORE
);

-- Cria a tabela personal
CREATE TABLE IF NOT EXISTS personal (
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id TEXT NOT NULL PRIMARY KEY,
    data JSONB NOT NULL,
    UNIQUE(id)
);

-- Para a tabela leveling
UPDATE leveling
SET modified = CURRENT_TIMESTAMP
WHERE user = '{INSERTUSER}' AND chat = '{INSERTGROUP}';

-- Para a tabela banks
UPDATE banks
SET modified = CURRENT_TIMESTAMP
WHERE id = '{INSERTUSER}';

-- Para a tabela personal
UPDATE personal
SET modified = CURRENT_TIMESTAMP
WHERE id = '{INSERTUSER}';

-- Para a tabela groups
UPDATE groups
SET modified = CURRENT_TIMESTAMP
WHERE id = '{INSERTGROUP}';

-- Comando customizado de SQL, se quiser fazer mais futuramente
{INSERTKEY};