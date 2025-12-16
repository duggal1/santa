import { NextRequest, NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN!);

export async function POST(req: NextRequest) {
  try {
    const { image, type } = await req.json();

    if (!image || !type) {
      return NextResponse.json(
        { error: "Missing image or type" },
        { status: 400 }
      );
    }

    // Extract base64 from data URL if needed
    let base64Data = image;
    if (image.startsWith("data:image/")) {
      base64Data = image.split(",")[1];
    }

    // Convert base64 → Buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Your prompts (unchanged)
  const enhancementPrompts = {
    'gentle': `
Visibly upgrade this image into an ultra-realistic, professional-grade photograph, as if captured with a high-end DSLR or flagship smartphone in perfect conditions.

Aggressively correct lighting, exposure, color balance, and contrast until the image is bright, vibrant, clean, and visually stunning.
Enhance textures, surfaces, materials, and details to look natural, tactile, and premium—wood grains sharper, fabrics richer, metals more reflective.
Eliminate noise, dullness, flatness, blur, and any low-quality artifacts completely.
Boost clarity, sharpness, and depth of field realistically, without halos or artificial oversharpening.

Keep the exact same room structure, camera angle, viewpoint, and overall layout.
Allow minor realistic upgrades to furniture, finishes, or small decor elements only if they enrich the realism and quality without altering the core composition—never make it worse, only richer and more believable.
Focus primarily on photographic perfection and subtle premium refinement.
`,

    'cozy': `
Transform this space into a noticeably warmer, more inviting, and deeply comfortable version of the same room, rich with emotional warmth.

Replace furniture, fabrics, rugs, cushions, and decor with softer, plush, and higher-quality alternatives—think thick wool, velvet, natural wood, and layered textiles.
Introduce warm ambient lighting, soft glows from lamps, textured walls, plants, and lived-in details that make it feel welcoming and cozy.
Make every change clearly visible, substantial, and emotionally impactful—richer materials, deeper colors, more tactile surfaces.

Preserve the exact room structure, spatial layout, and camera angle.
Allow full realistic replacement or upgrade of furniture and decor to achieve a superior, cozier result—never downgrade quality or comfort.
Output must feel ultra-realistic, like a professional interior photograph.
`,

    'calm': `
Redesign this space into a serene, modern minimalist interior with a clearly elevated, tranquil aesthetic.

Replace all furniture, surfaces, colors, and materials with clean, high-quality modern alternatives—simple lines, premium woods, stone, linen, and neutral palettes.
Eliminate clutter entirely; introduce balanced negative space, soft diffused natural light, subtle textures, and refined details.
Make the redesign obviously noticeable, more sophisticated, and visually soothing.

Keep the exact room structure, proportions, and camera angle.
Upgrade every element realistically to a richer, more premium level—better materials, better proportions, better harmony—never cheaper or busier.
Result must be ultra-realistic, like a high-end architectural photography shoot.
`,

    'luxury': `
Transform this space into an unmistakably high-end luxury interior while maintaining the same room structure and camera angle.

Completely replace furniture, finishes, lighting, and materials with opulent, expensive-looking alternatives—marble, brass, velvet, rich hardwoods, designer pieces, and layered professional lighting.
Add refined details: intricate textures, metallic accents, artisanal elements, and perfect symmetry that scream wealth and taste.
Make the upgrade dramatic, clearly visible, and substantially richer—higher ceilings feel grander, surfaces more polished, atmosphere more exclusive.

Preserve the spatial layout and viewpoint exactly.
Every change must elevate quality and realism—use only premium, believable materials that look touchably real in a professional photograph.
Never introduce anything cheap or tasteless; aim for timeless, ultra-realistic luxury.
`,
  };

    const enhancementPrompt =
      enhancementPrompts[type as keyof typeof enhancementPrompts] ??
      enhancementPrompts.gentle;


// 2️⃣ Buffer → Blob  (THIS WAS MISSING OR MISPLACED)
const imageBlob = new Blob([imageBuffer], {
  type: "image/jpeg",
});

// 3️⃣ Use the SAME variable
const resultBlob = await client.imageToImage({
provider: "wavespeed",
model: "Qwen/Qwen-Image-Edit",
  inputs: imageBlob, // ✅ now exists
  parameters: {
    prompt: enhancementPrompt,
  },
});


    // Convert Blob → base64
    const arrayBuffer = await resultBlob.arrayBuffer();
    const resultBase64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      image: `data:image/png;base64,${resultBase64}`,
    });

  } catch (error) {
    console.error("Enhancement Error:", error);
    return NextResponse.json(
      { error: "Could not enhance the image." },
      { status: 500 }
    );
  }
}
