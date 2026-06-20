import { ChatOpenAI } from "@langchain/openai";

/**
 * Fábrica centralizada de LLM.
 * Usa la API de DeepSeek con el endpoint compatible con OpenAI.
 * Todos los agentes importan desde aquí para mantener configuración única.
 */
export function createLLM(temperature: number = 0.2): ChatOpenAI {
  return new ChatOpenAI({
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
    temperature,
    configuration: {
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY ?? "",
    },
  });
}
