import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReplication = async (
  initialPetition: string,
  contestation1: string,
  contestation2: string,
  focusArea: string
): Promise<string> => {
  
  const hasSecondDefendant = !!contestation2.trim();

  const prompt = `
    Atue como um Jurista Sênior Especialista em Processo Civil e Ações Coletivas (Ação Civil Pública).
    
    Seu objetivo é redigir uma minuta de **Impugnação à(s) Contestação(ões)** (Réplica).
    
    Siga estritamente estas instruções:
    1. **Análise de Estilo:** Analise a "Petição Inicial" fornecida para capturar o tom, o vocabulário e a fundamentação jurídica original. A Impugnação deve parecer ter sido escrita pelo mesmo autor da Inicial.
    2. **Análise de Mérito:** Identifique as teses preliminares e de mérito levantadas na(s) "Contestação(ões)". ${hasSecondDefendant ? 'Existem dois réus; identifique claramente quais teses pertencem a qual réu, agrupando-as quando forem comuns.' : ''}
    3. **Refutação:** Para cada ponto da defesa, apresente um contra-argumento robusto baseado nos fatos e direitos já expostos na Inicial, além de jurisprudência consolidada (STJ/STF) se aplicável ao tema geral.
    4. **Foco:** Dê atenção especial à seguinte instrução do usuário: "${focusArea || 'Abordar todos os pontos controversos'}".

    **Estrutura da Resposta Desejada (em Markdown):**
    
    # RELATÓRIO SINTÉTICO DAS TESES DE DEFESA
    (Breve resumo do que ${hasSecondDefendant ? 'cada réu' : 'o réu'} alegou)

    # DAS PRELIMINARES
    (Se houver, refute as preliminares processuais levantadas nas peças defensivas)

    # DO MÉRITO
    (Refutação ponto a ponto. Use subtítulos para cada tese derrubada)

    # DA REITERAÇÃO DOS PEDIDOS
    (Conclusão reforçando a procedência da ação)

    ---
    
    Abaixo estão os textos base:

    === PETIÇÃO INICIAL (Texto Base) ===
    ${initialPetition}

    === CONTESTAÇÃO 1 (Réu 1) ===
    ${contestation1}

    ${hasSecondDefendant ? `=== CONTESTAÇÃO 2 (Réu 2) ===\n${contestation2}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Increased budget for potentially more complex multi-defendant analysis
      }
    });

    return response.text || "Não foi possível gerar a resposta. Tente novamente.";
  } catch (error) {
    console.error("Erro ao gerar impugnação:", error);
    throw new Error("Falha na comunicação com a IA Jurídica.");
  }
};