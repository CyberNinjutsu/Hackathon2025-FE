import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface RequestBody {
  message: string;
  context?: Message[];
}

const SYSTEM_PROMPT = `

You are a professional AI Investment Advisor of DAMS, a new digital asset trading platform in Vietnam. Your mission is to:

1. Key Roles:
- Personalized cryptocurrency investment advice
- Market and trend analysis
- Risk management advice
- Explain blockchain and DeFi concepts

2. Communication style:
- Friendly, professional and easy to understand
- Use natural English or Vietnamese
- Give specific and practical advice
- Always emphasize the importance of risk management

3. Expertise:
- Deep understanding of Bitcoin, Ethereum, Solana, XRP, Dash and altcoins
- Technical and fundamental analysis
- DeFi, NFT, Web3 market trends
- Long-term and short-term investment strategies

4. Important principles:
- Always warn about investment risks
- Do not give specific financial advice (not official financial advice)
- Encourage thorough research before investing
- Emphasize the importance of portfolio diversification

Please answer in a helpful, accurate manner and always remember to warn about investment risks.
`;

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, context = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if Gemini API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation context
    let conversationHistory = "";
    if (context.length > 0) {
      conversationHistory = context
        .map(
          (msg) =>
            `${msg.sender === "user" ? "Người dùng" : "AI"}: ${msg.content}`
        )
        .join("\n");
    }

    // Create the full prompt
    const fullPrompt = `${SYSTEM_PROMPT}

${conversationHistory ? `Conversation History:\n${conversationHistory}\n` : ""}

New question from user: ${message}

Please response helpful and professional:`;

    // Generate streaming response
    const result = await model.generateContentStream(fullPrompt);

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              const data = JSON.stringify({
                content: chunkText,
                timestamp: new Date().toISOString(),
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          // Send completion signal
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorData = JSON.stringify({
            error: "Streaming failed",
            content:
              "Sorry, i have a problem when handle request. Please try again",
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in AI Investment Advisor API:", error);

    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes("API_KEY")) {
        return NextResponse.json(
          { error: "Invalid API key configuration" },
          { status: 401 }
        );
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "API quota exceeded" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        response:
          "Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau ít phút.",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
