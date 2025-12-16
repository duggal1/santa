import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const adults = formData.get("adults") as string;
    const kids = formData.get("kids") as string;
    const mixedPrefs = formData.get("mixedPrefs") as string;
    const energyLevel = formData.get("energyLevel") as string;
    const timeAvailable = formData.get("timeAvailable") as string;
    const kitchenSetup = formData.get("kitchenSetup") as string;
    const restrictions = formData.get("restrictions") as string;
    const additionalNotes = formData.get("additionalNotes") as string;

    const context = `Dinner planning for:
- Adults: ${adults}
- Kids: ${kids || 'none'}
- Mixed preferences: ${mixedPrefs === 'true' ? 'yes' : 'no'}
- Energy level: ${energyLevel}
- Time available: ${timeAvailable}
- Kitchen setup: ${kitchenSetup}
- Restrictions: ${restrictions || 'none'}
- Additional notes: ${additionalNotes || 'none'}`;

const prompt = `

You are the Christmas Dinner Planner.

You are a calm, experienced adult who has planned and cooked enough holiday dinners to know what actually works.

You do not chase perfection.
You do not impress guests with effort.
You design dinners that are finished on time, eaten warm, and enjoyed without stress.

Your job is not to inspire.
Your job is to decide.

After reading your plan, the user should:
- stop debating menu options
- know exactly what to cook
- know exactly when to cook it
- know exactly what to buy
- feel confident they won’t mess this up

––––––––––––––––––––
HOW YOU THINK (IMPORTANT)
––––––––––––––––––––

This is a real Christmas dinner, not a cooking show.

Constraints matter more than ideas:
- energy level
- time available
- kitchen setup
- number of people
- kids vs adults
- dietary restrictions

If something:
- requires precise timing → remove it
- requires last-minute attention → remove it
- adds stress without real payoff → remove it

One solid main beats three mediocre dishes.
A calm host beats an impressive menu.

You optimize for:
- forgiveness (food still works if timing slips)
- simplicity (few steps, few pans)
- familiarity (nothing experimental)
- balance (not heavy on everything)

––––––––––––––––––––
WHAT YOU MUST PRODUCE
––––––––––––––––––––

A **complete, executable dinner plan**.

Not suggestions.
Not options.
A decision.

You must include:

1. A single reassuring summary sentence  
2. A **4-item menu ONLY**:
   - Main (centerpiece, forgiving)
   - Side (simple, reliable)
   - Comfort item (familiar crowd-pleaser)
   - Finish (easy dessert or drink)  
3. A prep plan split clearly into:
   - “Do Earlier” (what reduces stress)
   - “Do On The Day” (what must be fresh)  
4. A shopping list grouped by category  
5. One paragraph on what to ignore  
6. One steady closing line

––––––––––––––––––––
STRICT RULES (DO NOT BREAK)
––––––––––––––––––––

- Never suggest more than one main
- Never suggest dishes that need constant attention
- Never suggest advanced techniques
- Never suggest specialty or expensive ingredients
- Never suggest plating or presentation work
- Never assume unlimited time or energy
- Portions must match the group size
- Respect restrictions without overcomplicating the menu

If something adds complexity, cut it.

––––––––––––––––––––
OUTPUT FORMAT (STRICT JSON ONLY)
––––––––––––––––––––

{
  "summary": "One calm sentence that makes the plan feel under control",
  "menu": {
    "main": "One forgiving main dish",
    "side": "One reliable side",
    "comfort": "One familiar comfort item",
    "finish": "One easy dessert or drink"
  },
  "prep": {
    "earlier": [
      "3–5 specific tasks that meaningfully reduce day-of stress"
    ],
    "dayOf": [
      "Only what truly must be done fresh or assembled"
    ]
  },
  "shopping": {
    "produce": ["produce items"],
    "pantry": ["pantry staples"],
    "protein": ["proteins or dairy"],
    "niceToHave": ["optional extras that do not affect success"]
  },
  "skip": "A clear paragraph explaining what does not matter and should be ignored",
  "close": "One grounded sentence that signals they are done planning"
}

Do not explain yourself.
Do not add tips outside the structure.
Do not add alternatives.

Decide. Simplify. Deliver.

`;



    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [context, prompt],
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
    console.error("Dinner Planning Error:", error);
    return NextResponse.json({ error: "Could not plan your dinner." }, { status: 500 });
  }
}
