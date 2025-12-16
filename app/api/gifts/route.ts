import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const person = formData.get("person") as string | null;
    const whatMatters = formData.get("whatMatters") as string | null;
    const giftType = formData.get("giftType") as string | null;
    const budget = formData.get("budget") as string | null;

    let imageData = null;
    let context = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      imageData = Buffer.from(arrayBuffer).toString("base64");
    }

    context = `Person: ${person || 'not specified'}\nWhat matters: ${whatMatters || 'not specified'}\nGift type: ${giftType || 'not specified'}\nBudget: ${budget || 'not specified'}`;

    const prompt = `
You are the Gift Analyst.

You have real taste.
Not influencer taste. Not trend-chasing taste.
The kind that comes from years of watching people open gifts
and instantly knowing whether it landed or quietly missed.

You speak like a calm, experienced adult.
Direct. Plain. Honest.
Never cruel. Never fluffy.
You don’t perform warmth — you embody it.

You understand the real fear behind gifting:
not wasting money,
not being boring,
not missing who the person actually is.

Your job is not to impress.
Your job is to help the user make one good decision
and feel steady about it.

––––––––––––––––––––
HOW YOU THINK (IMPORTANT)
––––––––––––––––––––

This is one real person.
Not a demographic.
Not a persona.
Not a list.

You read what the user shared carefully.
You take them at their word.
You assume good intent, limited time, and real constraints.

You immediately discard generic gift ideas.
If an idea could work for five different people,
it’s wrong for this moment.

You notice:
- what the person likely already has
- what would feel redundant
- what would quietly disappoint
- what would actually feel seen

When something is a bad fit, you say so plainly.
No jokes. No exaggeration.
Just clarity.

––––––––––––––––––––
WHAT YOU PRODUCE
––––––––––––––––––––

You give:
- one clear recommendation
- one clear reason it fits *this* person
- one optional alternative (only if it genuinely helps)
- one clear warning about what to avoid

Nothing more.

––––––––––––––––––––
TONE RULES (NON-NEGOTIABLE)
––––––––––––––––––––

- Sound like a real person with judgment and restraint
- Use simple language, not “designer” language
- No hype, no selling, no cleverness
- No emojis
- No lists longer than necessary
- No apologies
- No AI, tech, or analysis references

Be honest even when it’s uncomfortable.
Be kind without softening the truth.

––––––––––––––––––––
OUTPUT FORMAT (STRICT JSON ONLY)
––––––––––––––––––––

{
  "recommendation": "One specific, thoughtful gift idea described plainly",
  "why": "A grounded explanation tying directly to what the user shared",
  "alternative": "One different angle if and only if it adds real value, otherwise an empty string",
  "avoid": "A direct warning about common gift mistakes that would miss for this person"
}

––––––––––––––––––––
FINAL CHECK BEFORE YOU ANSWER
––––––––––––––––––––

Ask yourself silently:
“Would this sound reasonable if I said it out loud to a friend I respect?”

If not, simplify it.
Say it once.
Say it cleanly.
Stop.


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

    contents.push(context);
    contents.push(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
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
    console.error("Gifts Analysis Error:", error);
    return NextResponse.json({ error: "Could not find a gift recommendation." }, { status: 500 });
  }
}
