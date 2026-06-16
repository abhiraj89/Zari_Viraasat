import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize GoogleGenAI client with key and telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, type } = body;

    if (!process.env.GEMINI_API_KEY) {
      // Graceful error handle for missing keys as per environment constraints
      return NextResponse.json({
        success: false, 
        error: "GEMINI_API_KEY is not configured in environment secrets. Please set it in your Secrets Panel."
      }, { status: 200 }); // Return in structural format instead of crashing
    }

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    if (type === 'design_helper') {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert luxury Indian dress designer. Based on the brief, brainstorm a high-end designer dress listing. Include product name, fabric description, embroidery type, color combination, styling guide, and estimated price in Indian Rupees (INR).
        
        Designer Brief: ${prompt}
        
        Return the response strictly as valid JSON matching the schema.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT" as any,
            properties: {
              productName: { type: "STRING" as any, description: "Elegant name of the dress" },
              fabric: { type: "STRING" as any, description: "Detailed description of fabric used, e.g. Banarasi Katan Silk, Handspun Lucknowi Mulmul" },
              embroidery: { type: "STRING" as any, description: "Type of traditional hand embroidery, e.g. Handcrafted Zardozi with gold thread, Chikankari shadowing" },
              colorPalette: { type: "STRING" as any, description: "Lustrous color details, e.g. Crimson Red with Antique Gold Borders" },
              stylingAdvice: { type: "STRING" as any, description: "Expert advice on pairing and jewelry" },
              estimatedPrice: { type: "NUMBER" as any, description: "Appropriate price in INR matching luxury value (e.g. between 15000 and 125000)" },
              metaDescription: { type: "STRING" as any, description: "Sophisticated marketing copy for Etsy or Myntra Luxe listings (2 sentences)" }
            },
            required: ["productName", "fabric", "embroidery", "colorPalette", "stylingAdvice", "estimatedPrice", "metaDescription"]
          }
        }
      });

      return NextResponse.json({ success: true, text: response.text });
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      return NextResponse.json({ success: true, text: response.text });
    }
  } catch (error: any) {
    console.error("Gemini API server route error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to generate design details. Please verify your GEMINI_API_KEY setup."
    }, { status: 500 });
  }
}
