import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateStoreSummary(reviews: string[]) {
  if (!process.env.GEMINI_API_KEY) {
    return "AI insights currently unavailable (API key missing).";
  }

  if (reviews.length === 0) {
    return "No reviews yet. Be the first to leave some feedback!";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert customer experience analyst. 
Read the following customer reviews for a store. 
Write a short, professional, and friendly 1-2 sentence summary of the general sentiment.
Focus on the main themes (e.g. what people loved most, or any common complaints).
Do not use formatting like bold or bullet points, just a simple paragraph.

Reviews:
${reviews.map((r, i) => `${i + 1}. "${r}"`).join("\n")}

Summary:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Failed to generate AI summary:", error);
    return "AI insights temporarily unavailable.";
  }
}

export async function generateReplySuggestions(reviewText: string, rating: number) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API key missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a helpful and professional Store Owner. 
A customer left a ${rating}-star review: "${reviewText}"

Please generate 3 different professional response options for the owner to send back.
Keep them concise (1-2 sentences each). 

The options should be:
1. "Professional" (Standard, polite business response)
2. "Personal" (Warm, empathetic, or enthusiastic depending on the rating)
3. "Short" (Brief and to the point)

Return only a valid JSON array of 3 strings. 
Example: ["Option 1", "Option 2", "Option 3"]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean potential markdown code blocks if AI included them
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to generate AI suggestions:", error);
    return [
      "Thank you for your feedback. We appreciate your support!",
      "We're sorry to hear about your experience. We'd like to make it right.",
      "Thanks for visiting us! We hope to see you again soon."
    ];
  }
}
