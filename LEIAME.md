# NIM Free Playground

## Uso rápido (sem deploy)
1. Abra `index.html` direto no navegador (duplo clique).
2. Cole sua chave da NVIDIA (`nvapi-...`) na barra lateral.
3. Escolha o modelo e converse.

⚠️ **A NVIDIA não libera CORS** para chamadas vindas direto do navegador
(confirmado pela própria NVIDIA em fórum de devs). Isso significa que o modo
"Direto" pode falhar com erro de rede — é esperado, não é bug do app.
Se isso acontecer, o app mostra um aviso e você troca pro modo "Via proxy" (abaixo).

## Uso com proxy (recomendado, resolve o CORS)
1. Suba esta pasta inteira (`index.html`, `api/chat.js`, `vercel.json`) num
   repositório novo no GitHub.
2. Importe o repositório na Vercel (vercel.com → New Project).
3. Deploy (nenhuma variável de ambiente é obrigatória — o app manda sua chave
   a cada requisição pelo header `Authorization`).
   - Opcional: se preferir não digitar a chave no navegador, defina
     `NVIDIA_API_KEY` nas Environment Variables do projeto na Vercel.
4. No `index.html`, troque o modo de conexão para **Via proxy** e cole a URL,
   ex: `https://seu-projeto.vercel.app/api/chat`.

## Modelos disponíveis
Os mesmos do `app_core.py` original: Llama 3.1 70B/405B, DeepSeek R1,
Qwen 3.5 397B, GLM-5.2, Nemotron 3 Super 120B, Mixtral 8x22B e
Llama 3.2 90B Vision (texto apenas nesta versão — upload de imagem não
está implementado ainda).
