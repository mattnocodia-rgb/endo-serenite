
import { GoogleGenAI, Type } from "@google/genai";

// Create AI instance on-demand to ensure updated API key usage
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function explainInflammation(recipeTitle: string, ingredients: string[]): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explique de manière simple et bienveillante pourquoi la recette "${recipeTitle}" (Ingrédients: ${ingredients.join(', ')}) est considérée comme anti-inflammatoire ou neutre pour une personne souffrant d'endométriose. Maximum 300 caractères.`,
      config: {
        systemInstruction: "Tu es un expert en nutrition anti-inflammatoire spécialisé dans l'endométriose. Ton ton est rassurant et pédagogique.",
      }
    });
    return response.text || "Explication non disponible.";
  } catch (error) {
    return "Erreur lors de la récupération de l'explication.";
  }
}

export interface MealDistribution {
  green: number;
  orange: number;
  red: number;
}

export async function generateMeals(
  distribution: MealDistribution, 
  dietTags: string[], 
  excludedIngredients: string[],
  householdSize: number
): Promise<any[]> {
  const total = distribution.green + distribution.orange + distribution.red;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Génère exactement ${total} idées de repas pour l'endométriose.
      REPARTITION :
      - ${distribution.green} repas "VERTS" (Score 9-10, hautement anti-inflammatoires)
      - ${distribution.orange} repas "ORANGES" (Score 6-8, neutres/équilibrés)
      - ${distribution.red} repas "ROUGES" (Score <6, plaisirs occasionnels)
      
      CONTRAINTES :
      - Nombre de convives : ${householdSize} personnes (ADAPTE LES QUANTITÉS)
      - Régimes : ${dietTags.join(', ')}
      - EXCLURE ABSOLUMENT : ${excludedIngredients.join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING, description: "green, orange, or red" },
              score: { type: Type.NUMBER },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING, description: "Ingrédient avec quantité" } }
            },
            required: ["title", "description", "category", "score", "ingredients"]
          }
        }
      }
    });
    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) {
    console.error("Meal generation error:", error);
    return [];
  }
}

export async function searchReplacementMeal(
  query: string,
  category: string,
  dietTags: string[],
  excludedIngredients: string[],
  householdSize: number
): Promise<any | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Trouve ou adapte une recette de "${query}" pour qu'elle corresponde à la catégorie "${category}" (score d'inflammation) et respecte les contraintes suivantes :
      - Régimes : ${dietTags.join(', ')}
      - Exclure : ${excludedIngredients.join(', ')}
      - Convives : ${householdSize} personnes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            score: { type: Type.NUMBER },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "description", "category", "score", "ingredients"]
        }
      }
    });
    return JSON.parse(response.text?.trim() || "null");
  } catch (error) {
    return null;
  }
}

export async function generateShoppingList(meals: any[]): Promise<any[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Regroupe tous les ingrédients de ces repas en une liste de courses cohérente, classée par rayons de supermarché. Combine les quantités si un ingrédient apparaît plusieurs fois.
      REPAS : ${JSON.stringify(meals)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Rayon (ex: Fruits et Légumes)" },
              items: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["category", "items"]
          }
        }
      }
    });
    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) {
    return [];
  }
}