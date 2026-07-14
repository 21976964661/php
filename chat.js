// api/chat.js
// Proxy mínimo para a API da NVIDIA (integrate.api.nvidia.com).
// Existe só porque a NVIDIA não libera CORS para chamadas vindas direto do navegador.
// Deploy: suba esta pasta (index.html + api/chat.js) num projeto novo na Vercel. Pronto.
//
// A chave pode vir de duas formas:
//  1) O navegador manda "Authorization: Bearer nvapi-..." (o app HTML já faz isso) -> mais simples, nada pra configurar.
//  2) Ou defina NVIDIA_API_KEY nas Environment Variables do projeto na Vercel, e nem precisa digitar a chave no site.

export const config = { runtime: 'edge' };

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

function corsHeaders(){
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export default async function handler(req){
  if (req.method === 'OPTIONS'){
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== 'POST'){
    return new Response(JSON.stringify({ error: 'Use POST' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  const incomingAuth = req.headers.get('authorization');
  const key = incomingAuth || (process.env.NVIDIA_API_KEY ? `Bearer ${process.env.NVIDIA_API_KEY}` : null);

  if (!key){
    return new Response(JSON.stringify({ error: 'Nenhuma chave da NVIDIA encontrada (header Authorization ou env NVIDIA_API_KEY).' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  let body;
  try{
    body = await req.text();
  } catch(e){
    return new Response(JSON.stringify({ error: 'Corpo da requisição inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  let upstream;
  try{
    upstream = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': key,
      },
      body,
    });
  } catch(e){
    return new Response(JSON.stringify({ error: 'Falha ao contatar a NVIDIA: ' + e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  // Repassa a resposta (streaming ou não) direto pro navegador, com CORS liberado.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'application/json',
      ...corsHeaders(),
    },
  });
}
