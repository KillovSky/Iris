# 🚀 Guia de Instalação Automática

Simplifique o processo de instalação e permita que a Íris assuma a maioria das tarefas por você. Este sistema de atualização está em fase BETA, e eventuais erros podem ocorrer se não for seguido conforme este guia. Certifique-se de executar em uma pasta segura e **VAZIA**. Para usuários do Windows, é recomendado o uso do `Git Bash`.

## 📝 Sumário

1. - [📚 Pré-requisitos](#-pré-requisitos)
2. - [🔍 Observações Importantes](#-observações-importantes)
3. - [▶️ Execução Automática](#%EF%B8%8F-execução-automática)

## 📚 Pré-requisitos:

Crie uma pasta vazia em algum diretório seguro, de preferência que não tenha espaços (a Íris lida bem com eles, mas alguns programas e módulos não).
- `C:\\Users\Meu Nome\Projetos\Iris` está incorreto, pois `Meu Nome` tem espaços.
- `C:\\Iris` está correto, mas não é uma opção muito segura, pois está na raiz do seu HD.
- `C:\\Projetos\Iris` está correto, não está na raiz do HD e não possui espaços.
- `C:\\Users\Username\Projetos\Iris` está correto, não está na raiz do HD, está em pasta segura e não possui espaços.

Certifique-se de ter o `cURL` instalado em seu sistema.
- **Windows:** Instale o `Git Bash`.
- **Linux e Termux:** `apt install curl`.
- **macOS:** `port install curl`.

Adicione `sudo` antes dos comandos, se necessário. Se não tiver o `apt` ou o `macports`, consulte um guia online para instalá-los.

## 🔍 Observações Importantes:

- **Windows:** A instalação automática dos programas requisitados ainda não está disponível no Windows, mas o Script fornecerá os links para uma instalação segura.
- Recomendamos a instalação manual dos programas requisitados conforme os [Guias de Instalação Manual](https://github.com/KillovSky/Iris#-guias-de-instala%C3%A7%C3%A3o). A instalação automática pode conter versões ultrapassadas, resultando em erros, especialmente em sistemas como o `Ubuntu Jammy`, que possui repositórios desatualizados.
- A instalação automática cobre apenas requisitos básicos, podendo deixar de instalar programas adicionais necessários, como o `build-essential` no Linux, e outros. **A PRIORIDADE É SEMPRE INSTALAR OS PROGRAMAS MANUALMENTE!**
- Não use os meios de atualização dos guias se fizer a instalação da forma abaixo, bugs podem ocorrer! Atualize manualmente!

## ▶️ Execução Automática:

Execute o seguinte comando para efetuar (quase) tudo automaticamente, independente do sistema:

```bash
curl https://raw.githubusercontent.com/KillovSky/Iris/main/lib/Scripts/Toolbox.sh > Toolbox.sh && bash Toolbox.sh
```

Este comando realizará as seguintes tarefas:

- Baixará a Íris mais recente, sem necessidade de `git clone`.
- Instalará os programas básicos, como `NodeJS`.
- Fornecerá uma lista com mais de 15 opções, desde configuração, instalação, atualização, até o download dos módulos NPM e inicialização.

Esteja atento, pois serão feitas perguntas para determinar a melhor forma de funcionamento para você.