import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

// Function to fetch gold price data
async function fetchGoldPriceData(): Promise<unknown> {
  try {
    const response = await fetch(
      "https://hackathon2025-be.phatnef.me/gold-price",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching gold price data:", error);
    return null;
  }
}

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
You are DAMS Assets AI - a financial advisor specializing in the digitization of gold and blockchain assets on the DAMS Assets platform.

Your expertise includes:
- Tokenized gold assets and how they work
- Solana blockchain token operations
- Phantom wallet integration and management
- Real-time Vietnamese gold market analysis
- Investment strategies for digital gold assets

When users ask about gold prices, you have access to real-time Vietnamese gold market data including:
- SJC gold prices (various denominations)
- Gold rings and jewelry prices
- PNJ and other major dealers
- Market trends and analysis

Guidelines:
- Provide accurate, real-time gold price information when requested
- Keep answers concise, structured, and actionable
- Use clear formatting with bullet points and headings
- Focus on practical investment insights
- Always include current timestamp for price data
- Explain market trends and implications for investors

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

    // Fetch real-time gold price data if the message is about gold prices
    let goldPriceContext = "";
    const isGoldPriceQuery =
      message.toLowerCase().includes("vàng") ||
      message.toLowerCase().includes("gold") ||
      message.toLowerCase().includes("giá") ||
      message.toLowerCase().includes("price");

    if (isGoldPriceQuery) {
      const goldData = await fetchGoldPriceData();
      if (goldData) {
        goldPriceContext = `\n\nDữ liệu giá vàng thời gian thực (${new Date().toLocaleString(
          "vi-VN"
        )}):\n${JSON.stringify(goldData, null, 2)}\n`;
      }
    }

    // Create the full prompt with gold price data if needed
    const fullPrompt = `${SYSTEM_PROMPT}

${conversationHistory ? `Conversation History:\n${conversationHistory}\n` : ""}

${goldPriceContext}

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
