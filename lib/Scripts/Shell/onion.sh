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
${GREEN}Bem vindo ao sistema de buscador onion!${END}

${RED}-${END} ${GREEN}Este sistema é parte do${END} ${RED}Projeto Íris${END}${GREEN}, caso você utilize externamente, precisa inserir a licença${END} ${RED}[MIT]${END} ${GREEN}do Projeto junto a seu sistema com esse arquivo, ou ao menos definir o nome de copyright.${END}

${RED}-${END} ${GREEN}Visite:${END} ${BLUE}https://github.com/KillovSky/KillovSky${END}

${GREEN}Para utilizar, você pode inserir o tipo de uso na frente de seu comando junto aos termos de busca, por exemplo:${END} ${YELLOW}'bash onion.sh raw Torrent'${END} ${GREEN}ou${END} ${YELLOW}'./onion.sh json The Hidden Wiki'${END}${GREEN}.${END}

${GREEN}Os seguintes métodos são suportados:${END}

${RED}-${END} ${YELLOW}'*'${END} ${GREEN}Significa${END} ${YELLOW}'tudo que venha antes ou depois do caractere'${END}${GREEN}, por exemplo:${END} ${YELLOW}'*h'${END} ${GREEN}funciona tanto como${END} ${YELLOW}'h'${END}${GREEN}, como${END} ${YELLOW}'--h'${END}${GREEN},${END} ${YELLOW}'aaaah'${END}${GREEN},${END} ${YELLOW}'aaaa-h'${END} ${GREEN}e entre outros.${END}

${RED}1.${END} ${YELLOW}*help*|*h${END} ${GREEN}= Exibe este menu (padrão).${END}

${RED}2.${END} ${YELLOW}*json* Termos${END} ${GREEN}= Exibe em formato JSON.${END}

${RED}3.${END} ${YELLOW}*raw* Termos${END} ${GREEN}= Exibe em formato RAW.${END}

${GREEN}Não somos responsáveis por conteúdos ilegais ou similares apresentados nessa ferramenta, os direitos de busca pertencem ao ${RED}'Ahmia'${END}${GREEN}.${END}
";

# Define os argumentos
args=("$@");

# Define a pesquisa
search=$(
    # Printa apartir do 2°
    echo "${@:2}" |

    # Troca espaços por +
    sed 's/ /+/g'
);

# Redefine o search para cancelar, caso não envie nada
search="${search:-'CANCELTHISSEARCHNOW'}";

# Verifica se enviou uma pesquisa
if [[ "$search" == *"CANCELTHISSEARCHNOW"* ]]; then
    # Printa que não
    printf "\n${RED}CANCEL:${END} ${YELLOW}Nenhum termo de busca foi enviado, por favor, defina um termo após especificar adequadamente o comando...${END}\n${usage}";

    # E sai
    exit 1;

    # Finaliza o if
fi;

# Para deixar bonito, resolvi fazer em forma de função, pique JavaScript
function searchDarknet {

    # Só insere o básico se não for um help
    if [[ "${args[0]}" == *raw* || "${args[0]}" == *json* ]]; then
        # Define o valor formatado básico
        pageRAW=$(
            # Adquire a página silenciosamente em HTML
            curl -s "https://ahmia.fi/search/?q=${search}" |

            # Remove 'breaklines' e 'tabs'
            tr -d "[\n|\t]" |
            
            # Remove espaços grandes
            sed 's/ \+ //g' |

            # Troca a 'class result' por dupla 'breakline'
            sed 's/class="result"/\n\n/g' |

            # Caso não tenha resultados, define algo para verificar, pois usar a tag 'p' falhará
            sed 's/<p id="noResults">/\n\nNORESULTSFOUND\n\n/g'
        );

        # Verifica se encontrou resultados
        if [[ "$pageRAW" == *"NORESULTSFOUND"* ]]; then
            # Printa que não
            printf "\n${RED}EMPTY:${END} ${YELLOW}Nenhum resultado foi encontrado na busca, verifique se digitou corretamente e tenha em mente que${END} ${RED}conteúdos adultos ${YELLOW}ou${END} ${RED}ilegais${END} ${YELLOW}podem ser filtrados.${END}\n";

            # E sai
            exit 1;

            # Finaliza o if
        fi;

        # Define como JSON, simplifica na formatação em RAW
        pageRAW=$(
            # Usa a página obtida como argumento de 'echo'
            echo "$pageRAW" |

            # Troca a 'href' pela 'key URL'
            sed 's/href=.*url=/\n\n,{"URL":"/g' |

            # Troca varias tags pela 'key description'
            sed 's/<\/a><\/h4><p>/","description":"/g' |

            # Troca a tag final 'p' e a inicial 'cite' pela 'key baseURL'
            sed 's/<\/p><cite>/","baseURL":"/g' |

            # Troca a tag final 'cite' ate 'timestamp' pela key 'lastSeen'
            sed 's/<\/cite>.*data-timestamp=/","lastSeen":/g' |

            # Troca a tag final 'span' por uma 'keyword DATE' para eventual uso
            sed 's/<\/span>.*$/DATE"/g' |

            # Cria um grouping da descrição e separa para obter o nome
            sed 's/">\(.*\)","desc/","name":"\1","desc/g' |

            # Troca a data no final junto ao 'keyword DATE' pela data formatada
            sed 's/.">\(.*\)DATE/.","dateSince":"\1/g' |

            # Adquire apenas as linhas da 'Object'
            grep '{"URL' |

            # Remove as quebras de linha
            tr -d "\n" |

            # Troca a '",{' pela '"}.{' do final da 'Object' 
            sed 's/",{/"},{/g' |

            # Troca a ',' no começo pela '[' da 'Array'
            sed 's/^,/[/g' |

            # Troca o final pela '}]' do final da 'Object/Array'
            sed 's/$/}]/g' |

            # Remove possiveis "Object's" corrompidas
            sed -e 's/\(.*"}\)\{1\}.*/\1]/'
        );

        # Finaliza o if
    fi;

    # Determina qual o tipo de função a rodar, usar ',,' converte em 'lowercase'
    case "${args[0],,}" in

        # JSON, os nomes de key contém espaço, então cuidado!
        *"json"*)
            # Define a variável com a resposta
            dadosFinais="$pageRAW";
        ;;

        # RAW
        *"raw"*)
            # Define a variável com a resposta
            dadosFinais=$(
                # Usa a página obtida como argumento de 'echo'
                echo "$pageRAW" |

                # Troca todas as '{' por uma 'breakline'
                sed 's/{/\n/g' |

                # Remove todas as '[', ']' e '}'
                tr -d '[]}' |

                # Troca todas as "URL's" por especificação 'RAW'
                sed 's/"URL":"/\nURL: /g' |

                # Troca todas as "Name's" por especificação 'RAW'
                sed 's/","name":"/\nNome: /g' |

                # Troca todas as "description's" por especificação 'RAW'
                sed 's/","description":"/\nDescrição: /g' |

                # Troca todas as "baseURL's" por especificação 'RAW'
                sed 's/","baseURL":"/\nHostname: /g' |

                # Troca todas as "lastSeen's" por especificação 'RAW'
                sed 's/","lastSeen":"/\nÚltima atualização: /g' |

                # Troca todas as "dateSince's" por especificação 'RAW'
                sed 's/","dateSince":"/\nTempo desde a atualização: /g' |

                # Deleta todas as '",' e '"'
                tr -d '",''"'
            );
        ;;

        # Menu de ajuda
        *"help"|*"h"|*)
            # Define como a usage lá de cima
            dadosFinais=$usage;
        ;;

        # Encerra a case switch
    esac;

    # Retorna os resultados
    printf "${dadosFinais}";
};

# Executa a função
searchDarknet;