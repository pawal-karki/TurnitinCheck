import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ checkId: string }> }
) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const { checkId } = await params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/check/by-id?apiKey=${API_KEY}&checkId=${checkId}`,
      { cache: "no-store" }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching check details:", error);
    return NextResponse.json(
      { error: "Failed to fetch check details" },
      { status: 500 }
    );
  }
}
