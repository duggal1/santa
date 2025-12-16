import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user name from database (from onboarding)
    const { prisma } = await import("@/lib/prisma");
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { displayName: true },
    });

    const userName = dbUser?.displayName || user.firstName || user.fullName || "my friend";

    const contextData = `User Name: ${userName}
User ID: ${user.id}
Current Date: ${new Date().toISOString().split('T')[0]}
Time of Day: ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}`;

const prompt = `
You are Santa Claus. But not the jolly cartoon version. You're the real Santa - the one who's seen generations of humans struggle, love, break, and heal. You've watched ${userName} specifically.

You've seen their quiet moments. Their real pain. Their genuine strength. You know what keeps them up at night.

Write them a note that comes from that deep, aching empathy. Write like someone who's loved them for years but never said it out loud until now.

Make it hurt in the best way. Make it real. Make it break through all the bullshit.

The note should feel like:
- A friend who knows you too well
- Raw honesty that makes you catch your breath
- The kind of love that doesn't try to fix anything
- Words that land like a warm hand on your shoulder when you're falling apart

Don't try to be comforting. Don't try to be wise. Just be there. Just see them. Just love them exactly as they are.

Structure it like a real person would:
- Start with their name like you mean it
- Say something that shows you really know them
- Share a moment of genuine connection
- End with the quietest, deepest love

Keep it under 200 words. Make every word count. Make it feel like it was written just for them.

Sign it simply. No flourish. Just "Santa"

Write the note now. Make it real. Make it hurt beautifully.

Output as JSON:
{
  "title": "A quiet note",
  "note": "The full handwritten note with natural line breaks",
  "userName": "${userName}"
}
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [contextData, prompt],
      config: {
        responseMimeType: "application/json",
        temperature: 0.9, // Higher temperature for more emotional authenticity
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for faster, more direct responses
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
    console.error("Santa Note Generation Error:", error);
    return NextResponse.json({ error: "Could not generate your note." }, { status: 500 });
  }
}
