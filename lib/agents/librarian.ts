import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createLLM } from "@/lib/llm";
import { LIBRARIAN_PROMPT } from "@/lib/prompts/librarian";
import type { Hallazgo, Documento } from "@/types";

const llm = createLLM(0.1);

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 100,
});

export async function runLibrarianAgent(documentos: Documento[]): Promise<Hallazgo[]> {
  const allHallazgos: Hallazgo[] = [];

  for (const doc of documentos) {
    const chunks = await splitter.createDocuments([doc.contenido]);

    // Procesar en batches de 5 para no sobrecargar la API
    const batchSize = 5;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk, idx) => {
        const estimatedPage = Math.floor((i + idx) / Math.max(1, chunks.length / doc.paginas)) + 1;

        try {
          const response = await llm.invoke([
            { role: "system", content: LIBRARIAN_PROMPT },
            {
              role: "user",
              content: `Analiza el siguiente fragmento del documento "${doc.nombre}" (fragmento ${i + idx + 1} de ${chunks.length}):\n\n${chunk.pageContent}`,
            },
          ]);

          const content = typeof response.content === "string" ? response.content : "";
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (!jsonMatch) return [];

          const parsed = JSON.parse(jsonMatch[0]) as Omit<Hallazgo, "fuente" | "pagina">[];
          return parsed.map((h) => ({
            ...h,
            fuente: doc.nombre,
            pagina: estimatedPage,
          }));
        } catch {
          return [];
        }
      });

      const results = await Promise.all(batchPromises);
      results.forEach((batch) => allHallazgos.push(...batch));
    }
  }

  return allHallazgos;
}
