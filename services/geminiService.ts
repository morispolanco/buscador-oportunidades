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
            sector: {
                type: Type.STRING,
                description: "El sector o categoría industrial más amplio al que pertenece el tipo de negocio. Por ejemplo, 'Hostelería y Restauración' para 'Cafeterías'."
            },
            businessType: {
                type: Type.STRING,
                description: "Un tipo específico de negocio o empresa dentro de la industria y el país objetivo."
            },
            managerEmail: {
                type: Type.STRING,
                description: "La dirección de correo electrónico de una persona específica como el gerente, propietario o director del negocio. No debe ser una dirección genérica como 'info@' o 'contacto@'. Por ejemplo: 'nombre.apellido@empresa.com'."
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
                        description: "El cuerpo completo del correo electrónico, dividido en párrafos cortos para facilitar la lectura. Debe presentar el problema (la necesidad urgente), proponer la solución de IA, explicar brevemente sus beneficios y terminar con una llamada a la acción clara. Debe estar firmado por 'Moris Polanco, CEO' con la URL 'https://soluciones-a-la-medida.base44.app/'."
                    }
                },
                required: ["subject", "body"]
            },
            acceptanceProbability: {
                type: Type.OBJECT,
                description: "Un índice que estima la probabilidad de que la propuesta sea aceptada por el negocio.",
                properties: {
                    rating: {
                        type: Type.STRING,
                        description: "La probabilidad de aceptación. Debe ser 'Alta'."
                    },
                    justification: {
                        type: Type.STRING,
                        description: "Una breve justificación para la calificación de probabilidad, basada en el poder adquisitivo o la capacidad innovadora del tipo de negocio."
                    },
                    score: {
                        type: Type.NUMBER,
                        description: "Una puntuación numérica de 1 a 10 que representa la probabilidad de aceptación. Debe ser consistente con la calificación 'Alta' (generalmente 8-10)."
                    }
                },
                required: ["rating", "justification", "score"]
            },
            easeOfCreation: {
                type: Type.NUMBER,
                description: "Puntuación de 1 a 10 para la facilidad de creación de la solución de IA (10 = más fácil)."
            },
            opportunityForGain: {
                type: Type.NUMBER,
                description: "Puntuación de 1 a 10 para la oportunidad de ganancia (10 = mayor ganancia)."
            }
        },
        required: ["sector", "businessType", "managerEmail", "urgentNeed", "aiSolutionName", "aiSolutionDescription", "appCreationPrompt", "proposalEmail", "acceptanceProbability", "easeOfCreation", "opportunityForGain"],
    },
};

export async function generateOpportunities(industry: string, country: string): Promise<ApiBusinessOpportunity[]> {
    const prompt = `
        Eres un analista de negocios experto y arquitecto de soluciones de IA especializado en Modelos de Lenguaje Grandes (LLM).
        Tu tarea es identificar 10 oportunidades de negocio distintas dentro de la industria '${industry}' en '${country}', enfocándote exclusivamente en aquellas con una 'Alta' probabilidad de aceptación.

        Para cada una de las 10 oportunidades, debes realizar el siguiente análisis:
        1.  **Identificar Sector:** Define un sector industrial amplio para agrupar el tipo de negocio. Por ejemplo, 'Hostelería y Restauración' para 'Cafeterías'.
        2.  **Identificar Tipo de Negocio:** Nombra un tipo específico de negocio o empresa que probablemente tenga los recursos y la mentalidad innovadora para adoptar una solución de IA.
        3.  **Obtener Correo Electrónico:** Proporciona una dirección de correo electrónico dirigida a una persona específica, como el gerente, propietario o director (p. ej., 'nombre.apellido@ejemplonegocio.com'). **Evita estrictamente direcciones genéricas** como 'info@...', 'contacto@...', 'ventas@...' o similares. El objetivo es contactar a un individuo responsable.
        4.  **Determinar Necesidad Urgente:** Identifica el problema empresarial más crítico y urgente que enfrenta este tipo de empresa. Sé específico y céntrate en un punto de dolor de alto impacto que justifique una inversión en tecnología.
        5.  **Proponer Solución de IA Basada en LLM:** Diseña una solución específica que utilice un Modelo de Lenguaje Grande (LLM) para resolver esa necesidad. La solución debe ser práctica y realizable con tecnologías LLM actuales. Dale a la solución un nombre creativo y una breve descripción.
        6.  **Generar Prompt de Desarrollo para LLM:** Crea un prompt detallado para un desarrollador de software. Este prompt debe describir cómo construir la aplicación de IA utilizando un LLM. Debe especificar el rol del LLM, qué datos específicos del cliente podría necesitar para ser efectivo y las funcionalidades clave.
        7.  **Redactar Correo de Propuesta:** Crea un objeto JSON con 'subject' y 'body' para un correo electrónico persuasivo dirigido al gerente.
            *   **subject:** Debe ser conciso y relevante.
            *   **body:** El cuerpo del correo debe identificar el problema, presentar la solución, explicar los beneficios, concluir con una llamada a la acción y estar firmado por 'Moris Polanco, CEO' en 'https://soluciones-a-la-medida.base44.app/'.
        8.  **Evaluar y Puntuar:** Proporciona una puntuación de 1 a 10 para los siguientes criterios:
            a.  **Facilidad de Creación (easeOfCreation):** Qué tan fácil es desarrollar la solución de IA. 10 significa muy fácil, 1 muy complejo.
            b.  **Oportunidad de Ganancia (opportunityForGain):** El potencial de ingresos o ahorro de costos para el negocio. 10 significa un potencial muy alto.
            c.  **Probabilidad de Aceptación (acceptanceProbability):** Asigna la calificación 'Alta'. Proporciona una breve justificación que explique por qué este tipo de negocio tiene un alto poder adquisitivo y una gran necesidad de innovación. Asigna una puntuación numérica (score) entre 8 y 10, consistente con la calificación 'Alta'.

        Devuelve toda la salida como un único array JSON válido de 10 objetos, conforme al esquema proporcionado. Es crucial que todos los objetos en el array tengan el campo 'rating' dentro de 'acceptanceProbability' establecido en 'Alta'. No incluyas ningún texto introductorio, formato markdown o cualquier contenido fuera del array JSON.
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