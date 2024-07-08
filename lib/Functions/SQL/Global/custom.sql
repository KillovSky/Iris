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