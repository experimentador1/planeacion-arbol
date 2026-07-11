/**
 * jsonRepair — recupera JSON truncado o malformado producido por LLMs.
 *
 * El LLM a veces corta la respuesta a mitad de un array o string.
 * Esta función intenta cerrar todos los corchetes/llaves abiertas.
 */

export function repairJson(raw: string): string {
  // Extraer el primer bloque JSON del texto
  const start = raw.indexOf("{");
  if (start === -1) throw new Error("No se encontró un objeto JSON en la respuesta");
  let jsonStr = raw.slice(start);

  // Intentar parseo directo primero
  try {
    JSON.parse(jsonStr);
    return jsonStr;
  } catch {
    // Continuar con reparación
  }

  // Rastrear la estructura con una pila
  const stack: string[] = [];
  let inString = false;
  let escape = false;
  let lastCompletePos = 0;

  for (let i = 0; i < jsonStr.length; i++) {
    const c = jsonStr[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\" && inString) {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (c === "{" || c === "[") {
      stack.push(c === "{" ? "}" : "]");
    } else if (c === "}" || c === "]") {
      if (stack.length > 0 && stack[stack.length - 1] === c) {
        stack.pop();
        if (stack.length === 0) lastCompletePos = i + 1;
      }
    }
  }

  // Si el JSON se completó correctamente en algún punto, usar hasta ahí
  if (lastCompletePos > 0 && stack.length === 0) {
    try {
      const candidate = jsonStr.slice(0, lastCompletePos);
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Continuar
    }
  }

  // Reparar: eliminar trailing incompleto y cerrar estructuras abiertas
  let repaired = jsonStr.trimEnd();

  // Quitar coma o dos puntos al final (elemento incompleto)
  repaired = repaired.replace(/[,:](\s*)$/, "");
  repaired = repaired.trimEnd();

  // Quitar string incompleto al final (sin cerrar "...)
  if ((repaired.match(/"/g) ?? []).length % 2 !== 0) {
    const lastQuote = repaired.lastIndexOf('"');
    repaired = repaired.slice(0, lastQuote);
    repaired = repaired.trimEnd().replace(/[,:](\s*)$/, "").trimEnd();
  }

  // Cerrar estructuras abiertas (en orden inverso)
  repaired += stack.reverse().join("");

  // Intento final de parseo
  try {
    JSON.parse(repaired);
    return repaired;
  } catch {
    // Último intento: extraer el JSON hasta la última llave completa de nivel 0
    const candidate = extractToLastComplete(jsonStr);
    if (candidate) return candidate;
    throw new Error(`JSON irreparable: ${raw.slice(0, 200)}…`);
  }
}

function extractToLastComplete(jsonStr: string): string | null {
  // Buscar el último '}' de nivel 0
  let depth = 0;
  let inString = false;
  let escape = false;
  let lastRoot = -1;

  for (let i = 0; i < jsonStr.length; i++) {
    const c = jsonStr[i];
    if (escape) { escape = false; continue; }
    if (c === "\\" && inString) { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (depth === 0) lastRoot = i + 1;
    }
  }

  if (lastRoot === -1) return null;
  try {
    const candidate = jsonStr.slice(0, lastRoot);
    JSON.parse(candidate);
    return candidate;
  } catch {
    return null;
  }
}
