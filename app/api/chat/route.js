import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    // 1. Check if we are in Mock Mode
    // You can set this in .env.local as MOCK_AI=true
    const isMockMode = process.env.MOCK_AI === "true";

    if (isMockMode) {
      // Simulate network delay (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return Response.json({ 
        text: `(MOCK) I received your message: "${message}". My API is currently resting to save quota!` 
      });
    }

    // 2. Real Gemini Logic (Only runs if MOCK_AI=false)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    return Response.json({ text: response.text() });

  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to respond" }, { status: 500 });
  }
}