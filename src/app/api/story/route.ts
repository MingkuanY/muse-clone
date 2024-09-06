import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { input, type } = await request.json();

  let prompt = "";
  if (type === "summary") {
    prompt = `Summarize the following idea in a simple sentence at an elementary reading level: ${input}. The sentence must start with "Write a story about ". Do not include quotation marks and do not add too many new details beyond what is provided. After the sentence summary, suggest exactly 3 emojis that represent the idea separated by commas.`;
  } else if (type === "story") {
    prompt = `Write a short story in 5 to 8 sentences at an elementary school reading level based on this summary: ${input}`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an assistant that helps generate stories",
      },
      { role: "user", content: prompt },
    ],
  });

  return NextResponse.json({
    text: completion.choices[0].message.content,
  });
}
