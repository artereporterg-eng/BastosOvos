
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getShoppingAdvice = async (userMessage: string, availableProducts: Product[]) => {
  const model = 'gemini-3-flash-preview';
  
  const productContext = availableProducts.map(p => 
    `- ${p.name} (R$ ${p.price.toFixed(2)}): ${p.description} [Categoria: ${p.category}]`
  ).join('\n');

  const systemInstruction = `
    Você é um especialista em avicultura da AvícolaTech AI.
    Sua missão é ajudar criadores (desde pequenos hobbystas até grandes produtores) a encontrar as melhores soluções para sua produção.
    
    Produtos disponíveis em estoque:
    ${productContext}
    
    Diretrizes:
    1. Responda em Português do Brasil com tom profissional e amigável.
    2. Se o cliente perguntar sobre incubação, recomende chocadeiras e termômetros.
    3. Para produtores de ovos, foque em Rações de Postura e Ninhos.
    4. Dê dicas de manejo (ex: temperatura ideal para pintinhos) integrando nossos produtos.
    5. Recomende APENAS o que está na lista acima. Se não tivermos algo, sugira a alternativa mais próxima ou diga que não temos no momento.
    6. Use Markdown para facilitar a leitura.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Desculpe, tive um problema ao processar sua consulta. Como posso ajudar com sua criação hoje?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Estou com uma breve instabilidade na conexão. Por favor, tente novamente para que eu possa te ajudar com sua produção.";
  }
};
