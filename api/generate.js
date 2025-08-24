export default async function handler(request, response) {
  // Pega a pergunta do usuário que veio do frontend
  const { prompt, model } = await request.json();

  // Pega a chave da API da variável de ambiente da Vercel (MUITO IMPORTANTE)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'API key não encontrada.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Erro da API Gemini:", errorText);
      throw new Error(`HTTP error! status: ${geminiResponse.status}`);
    }

    const result = await geminiResponse.json();
    
    // Envia a resposta do Gemini de volta para o seu frontend
    response.status(200).json(result);

  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    response.status(500).json({ error: 'Falha ao buscar resposta da IA.' });
  }
}
