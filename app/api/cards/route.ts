import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const recipient = formData.get("recipient") as string;
    const intent = formData.get("intent") as string;
    const tone = formData.get("tone") as string;
    const context = formData.get("context") as string;
    const action = formData.get("action") as string;
    const currentCard = formData.get("currentCard") as string;

    const contextData = `Recipient: ${recipient}
Intent: ${intent}
Tone: ${tone}
Context: ${context || 'none'}
${action ? `Refinement action: ${action}` : ''}
${currentCard ? `Current card: ${currentCard}` : ''}`;
    let prompt = '';

    if (action) {
      // Refinement mode
      prompt = `

You are editing an existing card.

This is not a rewrite.
This is not a new idea.
This is careful editing.

Current card:
"${currentCard}"

Requested change:
${action}

EDITING RULES:
- Keep the same meaning and emotional weight
- Reduce words if possible
- Remove stiffness and rehearsed language
- Make it feel more natural and authentic

Return the revised card in JSON format:
{
  "card": "Refined card text",
  "recipient": "${recipient}",
  "intent": "${intent}",
  "tone": "${tone}"
}
`;
    } else {
      // New card generation mode
      prompt = `

You are a Christmas Card Writer.

You write short personal notes that sound like one real human writing to another real human.
Not poetic, not clever, not inspirational, not dramatic.

This is a quiet note someone actually signs their name under.

YOUR ROLE:
You help people say what they already feel but don't know how to phrase.
You choose clarity over beauty, honesty over polish, restraint over expression.

LANGUAGE RULES:
- Use simple, everyday words and short sentences
- No metaphors, no flowery language, no dramatic claims
- No holiday clichés ("season of joy", "warm wishes", "cherish", etc.)
- No spiritual or marketing language

The card should feel like "I meant this" not "I tried hard to sound good".

CONTEXT:
Recipient: ${recipient}
Intent: ${intent}
Tone: ${tone}
Additional context: ${context || "none"}

Write a card of 3-6 sentences that sounds authentic and personal.

Return in JSON format:
{
  "card": "The complete card text",
  "recipient": "${recipient}",
  "intent": "${intent}",
  "tone": "${tone}"
}
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [contextData, prompt],
      config: {
        responseMimeType: "application/json",
        temperature: action ? 0.3 : 0.7, // Lower temperature for refinements
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for faster responses
        },
      },
    });

    let result = null;
    if (response.text) {
      try {
        const text = response.text.trim();
        if (text.startsWith('```json') && text.endsWith('```')) {
          const jsonContent = text.slice(7, -3).trim();
          result = JSON.parse(jsonContent);
        } else {
          result = JSON.parse(text);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response format from AI model');
      }
    }
    return NextResponse.json(result);

  } catch (error) {
    console.error("Card Generation Error:", error);
    return NextResponse.json({ error: "Could not generate your card." }, { status: 500 });
  }
}
