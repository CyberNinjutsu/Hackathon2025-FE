import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

interface GoldPriceData {
  [key: string]: any;
}

// Function to fetch gold price data
async function fetchGoldPriceData(): Promise<GoldPriceData | null> {
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

// Function to format gold price data for AI analysis
function formatGoldDataForAI(goldData: GoldPriceData): string {
  if (!goldData) {
    return "Không thể lấy dữ liệu giá vàng hiện tại.";
  }

  let formattedData = "Dữ liệu giá vàng hiện tại:\n";
  formattedData += `Thời gian cập nhật: ${new Date().toLocaleString(
    "vi-VN"
  )}\n\n`;

  // Format the data based on the structure
  if (typeof goldData === "object") {
    formattedData += JSON.stringify(goldData, null, 2);
  } else {
    formattedData += goldData.toString();
  }

  return formattedData;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question = "Phân tích giá vàng hiện tại" } = body;

    // Check if Gemini API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Fetch gold price data
    const goldData = await fetchGoldPriceData();
    const formattedGoldData = formatGoldDataForAI(goldData);

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const analysisPrompt = `
Bạn là chuyên gia phân tích thị trường vàng của DAMS Assets. Hãy phân tích dữ liệu giá vàng sau đây và trả lời câu hỏi của người dùng.

${formattedGoldData}

Câu hỏi của người dùng: ${question}

Hãy cung cấp phân tích chi tiết bao gồm:
1. Tóm tắt giá vàng hiện tại
2. Xu hướng thị trường (nếu có thể phân tích)
3. Khuyến nghị đầu tư
4. Các yếu tố ảnh hưởng đến giá vàng

Trả lời bằng tiếng Việt, sử dụng định dạng rõ ràng với bullet points và headings.
`;

    // Generate response
    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const analysisText = response.text();

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      goldData: goldData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in Gold Price Analysis API:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Không thể phân tích dữ liệu giá vàng. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to just fetch gold price data
export async function GET() {
  try {
    const goldData = await fetchGoldPriceData();

    if (!goldData) {
      return NextResponse.json(
        { error: "Unable to fetch gold price data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: goldData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching gold price data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
