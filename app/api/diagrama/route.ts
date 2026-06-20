import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ArquitecturaDiagram } from "@/app/components/ArquitecturaDiagram";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const buffer = await renderToBuffer(createElement(ArquitecturaDiagram));

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="STB_Arquitectura_Multiagente.pdf"`,
      },
    });
  } catch (error) {
    console.error("[Diagrama PDF] Error:", error);
    return NextResponse.json({ error: "Error generando diagrama" }, { status: 500 });
  }
}
