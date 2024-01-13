#!/usr/bin/env bash

# Script para verificar e instalar programas essenciais em diferentes sistemas operacionais
# É RECOMENDADO A INSTALAÇÃO MANUAL, EVITE ESSE SCRIPT!

# Detecta o sistema operacional
os=$(uname -s | tr '[:upper:]' '[:lower:]')

# Array associativo com URLs de instalação ou comandos de instalação
declare -A commands
commands=(
    # URLs e comandos para instalação de programas em diferentes sistemas operacionais
    # Windows
    [win32:bash]="https://gitforwindows.org/"
    [win32:git]="https://gitforwindows.org/"
    [win32:zip]="https://github.com/bmatzelle/gow/releases/tag/v0.8.0"
    [win32:node]="https://nodejs.org/en/download/"
    [win32:sqlite3]="https://www.sqlite.org/download.html"
    [win32:python3]="https://www.python.org/downloads/windows/"
    [win32:tesseract]="https://github.com/UB-Mannheim/tesseract/wiki"

    # Linux
    [linux:bash]="sudo apt install bash"
    [linux:zip]="sudo apt install zip unzip"
    [linux:git]="sudo apt install git"
    [linux:node]="sudo apt install nodejs build-essential"
    [linux:sqlite3]="sudo apt install sqlite3"
    [linux:python3]="sudo apt install python3"
    [linux:tesseract]="sudo apt install tesseract-ocr"

    # macOS
    [darwin:bash]="brew install bash"
    [darwin:zip]="brew install zip unzip"
    [darwin:git]="brew install git"
    [darwin:node]="brew install node"
    [darwin:sqlite3]="brew install sqlite"
    [darwin:python3]="brew install python@3"
    [darwin:tesseract]="brew install tesseract"

    # FreeBSD
    [freebsd:bash]="pkg install bash"
    [freebsd:zip]="pkg install zip unzip"
    [freebsd:git]="pkg install git"
    [freebsd:node]="pkg install node"
    [freebsd:sqlite3]="pkg install sqlite3"
    [freebsd:python3]="pkg install python3"
    [freebsd:tesseract]="pkg install tesseract"

    # OpenBSD
    [openbsd:bash]="pkg_add bash"
    [openbsd:zip]="pkg_add zip unzip"
    [openbsd:git]="pkg_add git"
    [openbsd:node]="pkg_add node"
    [openbsd:sqlite3]="pkg_add sqlite3"
    [openbsd:python3]="pkg_add python3"
    [openbsd:tesseract]="pkg_add tesseract"

    # Solaris
    [sunos:bash]="pkg install bash"
    [sunos:zip]="pkg install zip unzip"
    [sunos:git]="pkg install git"
    [sunos:node]="pkg install nodejs"
    [sunos:sqlite3]="pkg install sqlite3"
    [sunos:python3]="pkg install python37"
    [sunos:tesseract]="https://tesseract-ocr.github.io/tessdoc/Compiling.html"

    # AIX
    [aix:bash]="https://www.perzl.org/aix/index.php?n=Main.Bash"
    [aix:zip]="https://www.perzl.org/aix/index.php?n=Main.Zip | http://v14700.1blu.de/aix/index.php?n=Main.Unzip"
    [aix:git]="https://www.perzl.org/aix/index.php?n=Main.Git"
    [aix:node]="https://www.perzl.org/aix/index.php?n=Main.NodeJS"
    [aix:sqlite3]="https://www.perzl.org/aix/index.php?n=Main.Sqlite"
    [aix:python3]="https://www.perzl.org/aix/index.php?n=Main.Python"
    [aix:tesseract]="https://tesseract-ocr.github.io/tessdoc/Compiling.html"
)

# Função para imprimir as URLs de instalação ou executar os comandos
check() {
    local program=$1
    local value=${commands["$os:$program"]}

    # Verifica se a instalação ou o comando está disponível
    if [ -z "$value" ]; then
        echo "Instalação ou comando não encontrado para $program."
        return
    fi

    # Verifica se o programa já está instalado
    if command -v "$program" >/dev/null 2>&1; then
        echo "$program já está instalado."
    else
        # Se o valor for uma URL, exibe a mensagem para o usuário visitar a URL
        if [[ $value == http* ]]; then
            echo "Para instalar $program, visite: $value"
        else
            # Caso contrário, executa o comando de instalação
            echo "Executando: $value"
            eval "$value"
        fi
    fi
}

# Verifica o sistema operacional e imprime URLs ou executa comandos correspondentes
case $os in
    # Windows
    msys* | mingw* | cygwin* | win*)
        os="win32"
    ;;
        
    # Linux
    linux* | gnu*)
        os="linux"
    ;;
        
    # macOS
    darwin* | mac*)
        os="darwin"
    ;;
        
    # FreeBSD
    freebsd*)
        os="freebsd"
    ;;
    
    # OpenBSD
    openbsd*)
        os="openbsd"
    ;;
    
    # Solaris
    sunos*)
        os="sunos"
    ;;
        
    # Advanced Interactive eXecutive (AIX)
    aix*)
        os="aix"
    ;;
    
    # Outros
    *)
        echo "Sistema operacional não suportado neste script."
        exit 1
    ;;
esac

# Array com os programas necessários
programs=(
    "bash"
    "zip"
    "git"
    "node"
    "sqlite3"
    "python3"
    "tesseract"
)

# Manda os programas para verificação ou instalação
for program in "${programs[@]}"; do
    check "$program"
done

# Retorna código zero se não deu erros
exit 0