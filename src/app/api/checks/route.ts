import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.API_KEY;

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/checks?apiKey=${API_KEY}`,
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
    console.error("Error fetching checks:", error);
    return NextResponse.json(
      { error: "Failed to fetch checks" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/deleteAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey: API_KEY }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Plain text response like "All checks deleted successfully"
      data = { message: text };
    }

    if (!response.ok) {
      return NextResponse.json({ error: text }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting all checks:", error);
    return NextResponse.json(
      { error: "Failed to delete checks" },
      { status: 500 }
    );
  }
}
