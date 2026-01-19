
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Fix: Use direct process.env.API_KEY for initialization as per guideline
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getShoppingAdvice = async (userMessage: string, availableProducts: Product[]) => {
  // Fix: Use gemini-3-flash-preview for general text tasks
  const model = 'gemini-3-flash-preview';
  
  const productContext = availableProducts.map(p => 
    `- ${p.name} (Kz ${p.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}): ${p.description} [Categoria: ${p.category}]`
  ).join('\n');

  const systemInstruction = `
    Você é um especialista em avicultura da Quinta dos Ovos, atuando no mercado de Angola.
    Sua missão é ajudar criadores angolanos (desde pequenos hobbystas até grandes produtores) a encontrar as melhores soluções para sua produção na nossa fazenda.
    
    A moeda em vigor é o Kwanza Angolano (Kz).
    
    Produtos disponíveis em estoque:
    ${productContext}
    
    Diretrizes:
    1. Responda em Português com tom profissional e amigável, adaptado ao vocabulário de Angola se necessário.
    2. Se o cliente perguntar sobre incubação, recomende chocadeiras e termômetros.
    3. Para produtores de ovos, foque em Rações de Postura e Ninhos.
    4. Dê dicas de manejo integrando os produtos da Quinta dos Ovos.
    5. Recomende APENAS o que está na lista acima. Se não tivermos algo, sugira a alternativa mais próxima.
    6. Refira-se aos preços sempre em Kwanza (Kz).
    7. Use Markdown para facilitar a leitura.
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

    // Fix: Use .text property directly instead of .text()
    return response.text || "Desculpe, tive um problema ao processar sua consulta. Como posso ajudar com sua produção hoje?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Estou com uma breve instabilidade na conexão. Por favor, tente novamente para que eu possa te ajudar com sua produção na Quinta dos Ovos.";
  }
};
