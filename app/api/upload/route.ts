import { NextRequest, NextResponse } from "next/server";
import { runLibrarianAgent } from "@/lib/agents/librarian";
import type { Documento } from "@/types";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos" }, { status: 400 });
    }

    const documentos: Documento[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      let contenido = "";
      let paginas = 1;

      if (file.name.endsWith(".pdf")) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string; numpages: number }>;
        const data = await pdfParse(buffer);
        contenido = data.text;
        paginas = data.numpages;
      } else if (file.name.endsWith(".docx")) {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        contenido = result.value;
        paginas = Math.ceil(contenido.length / 3000);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const XLSX = require("xlsx") as typeof import("xlsx");
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const lineas: string[] = [];
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          lineas.push(`=== Hoja: ${sheetName} ===\n${csv}`);
        }
        contenido = lineas.join("\n\n");
        paginas = workbook.SheetNames.length;
      } else {
        return NextResponse.json(
          { error: `Formato no soportado: ${file.name}. Usa PDF, DOCX o XLSX.` },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop()?.toLowerCase();
      documentos.push({
        nombre: file.name,
        tipo: ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : "xlsx",
        contenido,
        paginas,
      });
    }

    const hallazgos = await runLibrarianAgent(documentos);

    return NextResponse.json({
      documentos: documentos.map((d) => ({
        nombre: d.nombre,
        tipo: d.tipo,
        paginas: d.paginas,
      })),
      hallazgos,
      total_hallazgos: hallazgos.length,
    });
  } catch (error) {
    console.error("[Librarian Agent] Error:", error);
    return NextResponse.json(
      { error: "Error procesando documentos. Verifica el archivo y vuelve a intentar." },
      { status: 500 }
    );
  }
}
