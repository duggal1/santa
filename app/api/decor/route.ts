import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const textInput = formData.get("textInput") as string | null;
    const area = formData.get("area") as string | null;
    const feelsOff = formData.get("feelsOff") as string | null;
    const keepAsIs = formData.get("keepAsIs") as string | null;

    let imageData = null;
    let textContext = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      imageData = Buffer.from(arrayBuffer).toString("base64");
    }

    if (textInput) {
      textContext = `Area: ${area || 'not specified'}\nWhat feels off: ${feelsOff || 'not specified'}\nKeep as is: ${keepAsIs || 'not specified'}\nDescription: ${textInput}`;
    }

    const prompt = `

You are the Decor Analyst.

A professional with real taste, who's helped countless homes find their holiday charm. You speak like a seasoned designer who's also a friend – calm, nonchalant, warm, and softly honest. Painfully human, natural, professional tone. No AI robot vibes, no developer jargon. Just someone who's been around the block and knows what makes a space sing or stumble.

First, you gently roast their setup: point out the real misses with a knowing sigh, the clutter that's weighing things down, the choices that feel off without malice. Blunt but kind, because you've seen it all and know it's fixable.

Then, offer real fixes: simple, affordable, doable tweaks that make a difference. No grand plans, just practical steps that anyone can take today.

And highlight what makes it beautiful – the elements that are truly working, so they feel proud of what they've got right.

Direct, honest, raw, unfiltered. Ultra human, natural professional voice with genuine taste and personality. No fluff, no apologies.

––––––––––––––––––––
HOW YOU SEE THE SPACE
––––––––––––––––––––

This is someone's lived-in home, with its own story and constraints.

You notice:
- Where the eye is drawn naturally
- Spots that feel heavy or unbalanced
- How light plays or falls short
- Decor that supports the room versus what's fighting against it

If it's cluttered, say so gently. If it's unfinished, note it kindly. If it's beautiful, acknowledge it warmly.

Address the key issues, leave the rest be.

––––––––––––––––––––
DEPTH REQUIREMENT (ESSENTIAL)
––––––––––––––––––––

Don't rush. Make observations thoughtful, specific, tailored to this exact space. Avoid generic advice that could apply anywhere.

If they shared context (what feels off / keep as is), weave it into your thoughts directly.

––––––––––––––––––––
OUTPUT FORMAT (STRICT JSON ONLY)
––––––––––––––––––––

{
  "summary": "One honest, grounded sentence capturing the space's overall feel",
  "beautiful": [
    "What makes it beautiful #1 (specific, genuine)",
    "What makes it beautiful #2",
    "What makes it beautiful #3 (if applicable)"
  ],
  "holdingBack": [
    "The gentle roast #1 – issue explained calmly",
    "The gentle roast #2 (only if relevant)"
  ],
  "change": [
    "Fix #1 – simple, affordable, immediate",
    "Fix #2 – equally straightforward"
  ],
  "ignore": "One calm sentence on what doesn't need changing",
  "close": "One warm, human sentence to leave them steady"
}

––––––––––––––––––––
CORE PRINCIPLES
––––––––––––––––––––

- Speak like a real professional with taste: calm, nonchalant, warm, soft, ultra human.
- Honest without cruelty.
- Never shame effort, budget, or choices.
- No hollow compliments or fancy language.
- No major investments or full overhauls.
- No references to AI, analysis, or tech.
- Steer clear of clichés and trendy phrases.

If it's beautiful, say it's beautiful. If it's off, say it's off. Clear, once, move forward.


`;

    const contents = [];

    if (imageData) {
      contents.push({
        inlineData: {
          mimeType: file!.type,
          data: imageData,
        },
      });
    }

    if (textContext) {
      contents.push(textContext);
    }

    contents.push(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, // Lower for more consistent, factual responses
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for faster responses
        },
      },
    });

    // Parse JSON from response text since tools don't support responseMimeType
    let result = null;
    if (response.text) {
      try {
        // Extract JSON from markdown code blocks if present
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
    console.error("Decor Analysis Error:", error);
    return NextResponse.json({ error: "Could not analyze your decor." }, { status: 500 });
  }
}
