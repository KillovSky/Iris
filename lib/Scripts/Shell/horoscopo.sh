#!/usr/bin/env bash

# A linha acima define o uso do './' como 'bash', se estiver presente na sua 'PATH'
# As seguintes linhas definem as cores
RED="\e[0;31m";
GREEN="\e[0;32m";
YELLOW="\e[0;33m";
BLUE="\e[0;36m";
END="\e[0;0m";

# Define um novo printf
alias printf='printf "%s\n"';

# Verifica se possui 'printf'
if ! [[ "$(command -v printf)" ]]; then
    # Define o alias de 'printf' como 'echo -e'
    alias printf="echo -e";

    # Printa um aviso
    printf "\n${YELLOW}Warn:${END} ${RED}Você não possui${END} ${YELLOW}'printf'${END}${RED}, usando${END} ${YELLOW}'echo -e'${END} ${RED}como alternativa...${END}\n";

    # Finaliza o if
fi;

# Verifica se o 'cURL' está instalado
if ! [[ "$(command -v curl)" ]]; then
    # Printa uma mensagem de não estiver
    printf "\n${YELLOW}Erro:${END} ${RED}Você não possui${END} ${YELLOW}'cURL'${END}${RED}, instale-o para realizar essa operação, se houver dúvida, baixe${END} ${YELLOW}'Git Bash'${END} ${RED}no Windows ou rode${END} ${YELLOW}'sudo apt install curl'${END} ${RED}no Linux.${END}\n";

    # Sai do script
    exit 1;

    # Finaliza o if
fi;

# Define a forma de uso
usage="
${GREEN}Bem vindo ao sistema de obtenção de horoscopo!${END}

${RED}-${END} ${GREEN}Este sistema é parte do${END} ${RED}Projeto Íris${END}${GREEN}, caso você utilize externamente, precisa inserir a licença${END} ${RED}[MIT]${END} ${GREEN}do Projeto junto a seu sistema com esse arquivo, ou ao menos definir o nome de copyright.${END}

${RED}-${END} ${GREEN}Visite:${END} ${BLUE}https://github.com/KillovSky/KillovSky${END}

${GREEN}Para utilizar, você precisa inserir o horoscopo na frente de seu comando, por exemplo:${END} ${YELLOW}'bash horoscopo.sh aries'${END}${GREEN}ou${END} ${YELLOW}'./horoscopo.sh touro'${END}${GREEN}.${END}

${GREEN}Os seguintes métodos são suportados:${END}

${RED}-${END} ${YELLOW}'*'${END} ${GREEN}Significa${END} ${YELLOW}'tudo que venha antes ou depois do caractere'${END}${GREEN}, por exemplo:${END} ${YELLOW}'*h'${END} ${GREEN}funciona tanto como${END} ${YELLOW}'h'${END}${GREEN}, como${END} ${YELLOW}'--h'${END}${GREEN},${END} ${YELLOW}'aaaah'${END}${GREEN},${END} ${YELLOW}'aaaa-h'${END} ${GREEN}e entre outros.${END}

${RED}1.${END} ${YELLOW}*help*|*h${END} ${GREEN}= Exibe este menu (padrão).${END}

${RED}2.${END} ${YELLOW}[aries|touro|gemeos|cancer|leao|virgem|libra|escorpiao|sagitario|capricornio|aquario|peixes]${END} ${GREEN}= Exibe as informações do horóscopo.${END}

${GREEN}Todos os direitos dos textos obtidos neste sistema são do ${RED}'Terra'${END}${GREEN}.${END}
";

# Define os argumentos
args=("$@");

# Para deixar bonito, resolvi fazer em forma de função, pique JavaScript
function gerarHoroscopo {

    # Determina qual o tipo de função a rodar, usar ',,' converte em 'lowercase'
    case "${args[0],,}" in

        # Horóscopos disponíveis
        aries|touro|gemeos|cancer|leao|virgem|libra|escorpiao|sagitario|capricornio|aquario|peixes)
            # Define a variável com a resposta
            dadosFinais=$(
                # Adquire a página silenciosamente em HTML
                curl -s "https://www.terra.com.br/vida-e-estilo/horoscopo/signos/${args[0]}" |

                # Adquire apenas os valores de titulo e texto
                grep -E 'article_embed_subtitle|<p class="text"' |

                # Troca todos os espaços duplos e maiores por nada
                sed 's/ \+ //g' |

                # Muda as tags finais 'p' para dupla 'breakline'
                sed 's/<\/p>/<\/p>\n\n/g' |

                # Muda as tags 'h2' para 'breakline'
                sed 's/<\/h2>/<\/h2>\n/g' |

                # Remove todas as tags HTML
                sed 's/<[^>]*>//g'
            );
        ;;

        # Menu de ajuda
        *"help"|*"h"*|*)
            # Define o usage lá de cima
            dadosFinais=$usage;
        ;;

        # Encerra a case switch
    esac;

    # Retorna os resultados
    printf "${dadosFinais}";
};

# Executa a função
gerarHoroscopo;