import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    auth.protect();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { message: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const { documentData, question } = await req.json();

    if (!question || !documentData) {
      return NextResponse.json(
        { message: "Missing documentData or question" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const docJson =
      typeof documentData === "string"
        ? documentData
        : JSON.stringify(documentData);
    const truncated =
      docJson.length > 120_000 ? docJson.slice(0, 120_000) : docJson;

    const prompt = `
You are an assistant answering questions strictly based on the provided document content.
Document (BlockNote/Yjs JSON):
${truncated}

Question: ${question}

Instructions:
- Use only the document content above.
- If the answer is not in the document, say you couldn't find it.
- Keep the answer clear and concise.
`;

    const result = await model.generateContent(prompt);
    const message = result.response.text();

    return NextResponse.json({ message }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to process request" },
      { status: 500 }
    );
  }
}
