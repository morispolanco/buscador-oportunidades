import { GoogleGenAI, Type } from "@google/genai";
import type { ApiBusinessOpportunity } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            businessType: {
                type: Type.STRING,
                description: "Un tipo específico de negocio o empresa dentro de la industria y el país objetivo."
            },
            managerEmail: {
                type: Type.STRING,
                description: "La dirección de correo electrónico del gerente, propietario o persona a cargo del negocio. Puede ser un correo electrónico plausible o genérico si no se encuentra uno real (por ejemplo, 'contacto@nombreempresa.com')."
            },
            urgentNeed: {
                type: Type.STRING,
                description: "La necesidad empresarial más apremiante, urgente y crítica que enfrenta este tipo de empresa."
            },
            aiSolutionName: {
                type: Type.STRING,
                description: "Un nombre creativo y apropiado para una aplicación impulsada por un LLM que resuelve la necesidad identificada."
            },
            aiSolutionDescription: {
                type: Type.STRING,
                description: "Una breve descripción de la solución de IA basada en LLM propuesta y sus beneficios."
            },
            appCreationPrompt: {
                type: Type.STRING,
                description: "Un prompt detallado y procesable para que un desarrollador de software construya esta aplicación de IA utilizando un LLM. Debe describir las características principales, el rol del LLM y los datos del cliente necesarios."
            },
            proposalEmail: {
                type: Type.OBJECT,
                description: "Un correo electrónico de propuesta de ventas completo y profesional dirigido al gerente.",
                properties: {
                    subject: {
                        type: Type.STRING,
                        description: "El asunto del correo electrónico de la propuesta. Debe ser conciso, profesional y atractivo."
                    },
                    body: {
                        type: Type.STRING,
                        description: "El cuerpo completo del correo electrónico. Debe presentar el problema (la necesidad urgente), proponer la solución de IA, explicar brevemente sus beneficios y terminar con una llamada a la acción clara."
                    }
                },
                required: ["subject", "body"]
            }
        },
        required: ["businessType", "managerEmail", "urgentNeed", "aiSolutionName", "aiSolutionDescription", "appCreationPrompt", "proposalEmail"],
    },
};

export async function generateOpportunities(industry: string, country: string): Promise<ApiBusinessOpportunity[]> {
    const prompt = `
        Eres un analista de negocios experto y arquitecto de soluciones de IA especializado en Modelos de Lenguaje Grandes (LLM).
        Tu tarea es identificar 20 oportunidades de negocio distintas dentro de la industria '${industry}' en '${country}'.

        Para cada una de las 20 oportunidades, debes realizar el siguiente análisis:
        1.  **Identificar Tipo de Negocio:** Nombra un tipo específico de negocio o empresa.
        2.  **Obtener Correo Electrónico:** Proporciona una dirección de correo electrónico plausible para el gerente, propietario o persona a cargo. Si no se puede encontrar un correo real, crea uno genérico pero realista (por ejemplo, 'contacto@ejemplonegocio.com' o 'gerencia@ejemplonegocio.es').
        3.  **Determinar Necesidad Urgente:** Identifica el problema empresarial más crítico y urgente que enfrenta este tipo de empresa. Sé específico y céntrate en un punto de dolor de alto impacto.
        4.  **Proponer Solución de IA Basada en LLM:** Diseña una solución específica que utilice un Modelo de Lenguaje Grande (LLM) para resolver esa necesidad. La solución debe ser práctica y realizable con tecnologías LLM actuales (ej. chatbots, análisis de texto, generación de contenido, sistemas de preguntas y respuestas). Considera que el LLM podría necesitar acceder a datos privados del cliente (como bases de datos de productos, historiales de clientes, documentos internos) para dar respuestas más precisas y personalizadas. Dale a la solución un nombre creativo y una breve descripción.
        5.  **Generar Prompt de Desarrollo para LLM:** Crea un prompt detallado para un desarrollador de software. Este prompt debe describir cómo construir la aplicación de IA utilizando un LLM. Debe especificar el rol del LLM, qué datos específicos del cliente podría necesitar para ser efectivo (si aplica) y las funcionalidades clave.
        6.  **Redactar Correo de Propuesta:** Crea un objeto JSON con 'subject' y 'body' para un correo electrónico persuasivo dirigido al gerente.
            *   **subject:** Debe ser conciso y relevante, por ejemplo: "Propuesta de IA para optimizar [Necesidad Urgente] en [Tipo de Negocio]".
            *   **body:** El cuerpo del correo debe:
                a.  Identificar la necesidad urgente que has detectado.
                b.  Presentar la solución de IA (usando el nombre de la solución).
                c.  Explicar los beneficios clave.
                d.  Concluir con una llamada a la acción clara para programar una reunión.
                e.  Mantener un tono de consultor experto, no de vendedor genérico.

        Devuelve toda la salida como un único array JSON válido de 20 objetos, conforme al esquema proporcionado. No incluyas ningún texto introductorio, formato markdown o cualquier contenido fuera del array JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        const opportunities: ApiBusinessOpportunity[] = JSON.parse(jsonText);
        
        if (!Array.isArray(opportunities) || opportunities.length === 0) {
            throw new Error("La API devolvió una respuesta vacía o inválida.");
        }
        
        return opportunities;

    } catch (error) {
        console.error("Error generando oportunidades:", error);
        throw new Error("No se pudieron obtener y analizar las oportunidades de negocio de la IA. Por favor, revisa la consola para más detalles.");
    }
}