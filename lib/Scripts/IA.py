# Importa os módulos
import argparse
import torch
from transformers import BlenderbotSmallTokenizer, BlenderbotSmallForConditionalGeneration

# Verifica se CUDA está disponível
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Define o parser de argumentos
parser = argparse.ArgumentParser(description='Faça uma pergunta ao bot, mas não complexa, não somos o chatGPT!')
parser.add_argument('question', type=str, help='Sua pergunta para o bot')
args = parser.parse_args()

# Carrega o tokenizador e o modelo para a CPU
tokenizer = BlenderbotSmallTokenizer.from_pretrained("facebook/blenderbot_small-90M")
model = BlenderbotSmallForConditionalGeneration.from_pretrained("facebook/blenderbot_small-90M").to(device)

# Função para gerar a resposta
def generate_response(question):
  """
  Gera a resposta para a pergunta do usuário.

  Args:
    question: A pergunta do usuário como string.

  Retorna:
    A resposta do modelo como string.
  """

  # Converta a pergunta em tokens
  input_ids = tokenizer(question, return_tensors="pt").input_ids.to(device)

  # Otimização 1: Desativar o cálculo de gradientes
  # Otimização 2: Usar inferência de precisão mista (AMP)
  with torch.no_grad(), torch.cuda.amp.autocast():
    # Gere a resposta
    respids = model.generate(input_ids)

  # Decodifica a resposta
  response = tokenizer.decode(respids[0], skip_special_tokens=True)

  # Retorna a resposta
  return response

# Gera e imprime a resposta
response = generate_response(args.question)
print(response)

