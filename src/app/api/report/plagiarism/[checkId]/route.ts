import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ checkId: string }> }
) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const { checkId } = await params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/report/plag?apiKey=${API_KEY}&checkId=${checkId}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    // Stream the PDF response
    const pdfBuffer = await response.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="plagiarism_report_${checkId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error fetching plagiarism report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plagiarism report' },
      { status: 500 }
    );
  }
}

