import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.API_KEY;

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create new FormData for the external API
    const externalFormData = new FormData();
    externalFormData.append("apiKey", API_KEY);
    externalFormData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/check`, {
      method: "POST",
      body: externalFormData,
    });

    const text = await response.text();

    // Try to parse as JSON, otherwise return as error message
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Response is plain text (like "Invalid API key")
      data = { error: text };
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error submitting check:", error);
    return NextResponse.json(
      { error: "Failed to submit check" },
      { status: 500 }
    );
  }
}
