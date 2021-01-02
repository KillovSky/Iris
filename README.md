# iris
Uma bot em português feita para o grupo Legião Z no WhatsApp, com centenas de comandos.

# Funções
Há funções desde stickers a criação de Memes, receber hentais ou coisa parecida.
Irei melhorar esse read-me um dia.

# Coisas que você deve fazer!
Primeiro, edite totalmente as apis, elas estão na Functions.js dentro da pasta lib, e na config.js definido na apitech e no remove.bg, você vai achar comentarios em tudo, é so seguir.

# Agradecimentos
Um agradecimento a @Aruga-Z e @MhankBarBar, além dos diversos donos de excelentes API's utilizadas nesse BOT.

# Exemplo da criação de comandos
Simples! Use dessa forma abaixo para criar um simples comando de resposta.

Case 'nome do comando':
  (Use um if caso tenha um tipo de requisição) como... if (!isOwner) return kill.reply(from, 'Você não é o dono!', id)
  kill.reply(from, 'Mensagem que queira', id)
  break
  
# Explicação
Ok, sabemos que eu sou pessimo nisso haha!
Mas o case define o seu comando, o break o para pra não rodar o codigo todo e bugar ate o proximo break.
O if especifica uma condiçao, como eu fiz ali, aquela ali diz que precisa ser o dono.
O kill.reply envia uma resposta a uma mensagem, você pode usar kill.sendText para enviar uma mensagem mais comum.
O id no final serve pra marcar a pessoa de volta.
O from, é o grupo atual, se souber a id (comando /ID), pode definir um grupo especifico.
E a mensagem entre ' ' é o seu conteúdo.
