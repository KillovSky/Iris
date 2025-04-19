# Estágio 1: Ambiente de construção (Builder)
FROM node:20 AS builder

# Define o diretório de trabalho DENTRO do container de build
WORKDIR /app

# Instala o git E jq para clonar o repositório e modificar um arquivo json
RUN apt-get update && \
    apt-get install -y --no-install-recommends git jq && \
    rm -rf /var/lib/apt/lists/*

# Clonamos o repositório no diretório de trabalho (/app)
RUN git clone https://github.com/KillovSky/Iris.git .

# Altera a linha em index.js (Correção de erro 500)
RUN sed -i 's/messageData.blockNumber = await kill.fetchBlocklist();/messageData.blockNumber = [];/' /app/lib/Commands/Main/Construct/index.js

# Altera a propriedade "fixEscape" no arquivo "config.json" para true
RUN jq '.fixEscape.value = true' /app/lib/Databases/Configurations/config.json > /app/lib/Databases/Configurations/config.json.tmp && \
    mv /app/lib/Databases/Configurations/config.json.tmp /app/lib/Databases/Configurations/config.json

# Instala as dependências de produção usando --omit=dev (antiga flag de produção)
RUN npm install --omit=dev

# Força a atualização do pacote youtube-dl-exec (se necessário)
RUN npm uninstall youtube-dl-exec && npm install youtube-dl-exec@latest --omit=dev

# Estágio 2: Ambiente de tempo de execução (Runtime)
# Usando a imagem slim do Node.js para um tamanho menor
FROM node:20-slim AS runtime

# Define o diretório de trabalho final como /Iris
WORKDIR /Iris

# Instala as dependências de runtime necessárias no sistema operacional
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    sqlite3 \
    python3 \
    tesseract-ocr \
    #tesseract-ocr-por # Adicione pacotes de idioma se necessário
    zip \
    unzip \
    nano \
    git && \
    rm -rf /var/lib/apt/lists/*

# Copia a aplicação construída (do /app no builder) para /Iris no runtime
# Já com os arquivos modificados
COPY --from=builder /app /Iris

# Expõe a porta
EXPOSE 3000

# Define o comando para iniciar a Iris
CMD ["node", "/Iris/lib/Initialize/checker.js"]
