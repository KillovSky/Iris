#!/usr/bin/env bash

# A linha acima define o uso do './' como 'bash', se estiver presente na sua 'PATH'
# Define as cores
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
${GREEN}Bem vindo ao sistema de geração de dados pessoais!${END}

${RED}-${END} ${GREEN}Este sistema é parte do${END} ${RED}Projeto Íris${END}${GREEN}, caso você utilize externamente, precisa inserir a licença${END} ${RED}[MIT]${END} ${GREEN}do Projeto junto a seu sistema com esse arquivo, ou ao menos definir o nome de copyright.${END}

${RED}-${END} ${GREEN}Visite:${END} ${BLUE}https://github.com/KillovSky/KillovSky${END}

${GREEN}Para utilizar, você pode inserir o tipo de uso na frente de seu comando, por exemplo:${END} ${YELLOW}'bash gerador.sh raw'${END} ${GREEN}ou${END} ${YELLOW}'./gerador.sh json'${END}${GREEN}.${END}

${GREEN}Os seguintes métodos são suportados:${END}

${RED}-${END} ${YELLOW}'*'${END} ${GREEN}Significa${END} ${YELLOW}'tudo que venha antes ou depois do caractere'${END}${GREEN}, por exemplo:${END} ${YELLOW}'*h'${END} ${GREEN}funciona tanto como${END} ${YELLOW}'h'${END}${GREEN}, como${END} ${YELLOW}'--h'${END}${GREEN},${END} ${YELLOW}'aaaah'${END}${GREEN},${END} ${YELLOW}'aaaa-h'${END} ${GREEN}e entre outros.${END}

${RED}-${END} ${YELLOW}'null'${END} ${GREEN}significa não especificar ou utilizar um valor incompatível.${END}

${RED}1.${END} ${YELLOW}*help*|*h${END} ${GREEN}= Exibe este menu (padrão).${END}

${RED}2.${END} ${YELLOW}*json*${END} ${GREEN}= Exibe em formato JSON.${END}

${RED}3.${END} ${YELLOW}*raw*|null${END} ${GREEN}= Exibe em formato RAW.${END}

${GREEN}Os dados enviados são gerados por computador e não correspondem aos dados reais, qualquer similaridade com dados reais ou correspondência com os mesmos é mera eventualidade, não somos responsáveis por usos de má fé, todos os direitos de geração reservados ao ${RED}'invertexto'${END}${GREEN}.${END}
";

# Define os argumentos
args=("$@");

# Para deixar bonito, resolvi fazer em forma de função, pique JavaScript
function gerarDados {

    # Só insere o básico se não for um help
    if [[ "${args[0]}" == *raw* || "${args[0]}" == *json* ]]; then
        # Define o valor formatado básico
        pageRAW=$(
            # Adquire a página silenciosamente em HTML
            curl -s https://www.invertexto.com/gerador-de-pessoas |

            # Adquire apenas as linhas de informação
            grep -E "<label>|<input" |

            # Troca o inicio da tag 'label' por '"'
            sed 's/<label>/"/g'
        );

        # Finaliza o if
    fi

    # Determina qual o tipo de função a rodar, usar ',,' converte em 'lowercase'
    case "${args[0],,}" in

        # JSON, os nomes de key contém espaço, então cuidado!
        *"json"*)
            # Define a variável com a resposta
            dadosFinais=$(
                # Usa a página obtida como argumento de 'echo'
                echo "$pageRAW" |

                # Troca o final da tag HTML 'label' por '":'
                sed 's/<\/label>/":/g' |

                # Troca a tag 'input' e seus dados internos por nada
                sed 's/<input.*value=//g' |

                # Troca os '>' remanescentes por ','
                sed 's/>/,/g' |

                # Remove as 'tabs' e as 'breaklines'
                tr -d "[\t|\n]" |

                # Troca a primeira '"' pelo '{"' do JSON
                sed 's/^"/{"/g' |

                # Troca a última ',' pelo '}' do JSON
                sed 's/,$/}/g'
            );
        ;;

        # RAW
        *"raw"*)
            # Define a variável com a resposta
            dadosFinais=$(
                # Usa a página obtida como argumento de 'echo'
                echo "$pageRAW" |

                # Troca o final da tag HTML 'label' por ': '
                sed 's/<\/label>/: /g' |

                # Troca a tag 'input' e seus dados internos por nada
                sed 's/<input.*value="//g' |

                # Troca os '>' remanescentes por nada
                sed 's/">//g' |

                # Remove as 'tabs' e as 'breaklines'
                tr -d "[\t|\n]" |

                # Remove a 1° '"' para não criar uma 'breakline' inválida
                sed 's/^"//g' |

                # Troca as '"' por 'breaklines'
                sed 's/"/\n/g'
            );
        ;;

        # Menu de ajuda
        *"help"|*"h"*|*)
            # Define como a usage lá de cima
            dadosFinais=$usage;
        ;;

        # Encerra a case switch
    esac;

    # Retorna os resultados
    printf "${dadosFinais}";
};

# Executa a função
gerarDados;