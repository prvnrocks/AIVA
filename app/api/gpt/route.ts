// app/api/gpt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    console.log("test");
    try {
        const body = await req.json();
        const { messages } = body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // ✅ Correct model name
            messages,
        });

        const reply = response.choices[0].message.content;
        return NextResponse.json({ reply });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
