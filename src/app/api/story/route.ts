import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { input, type } = await request.json();

  let prompt = "";
  if (type === "summary") {
    prompt = `Summarize this idea in a simple sentence that starts with "Write a story about ${input}." Do not add too many new details beyond what is provided.`;
  } else if (type === "story") {
    prompt = `Write a short story in 5 to 8 sentences at an elementary school reading level based on this summary: ${input}`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an assistant that helps generate stories.",
      },
      { role: "user", content: prompt },
    ],
  });

  return NextResponse.json({
    text: completion.choices[0].message.content,
  });
}
