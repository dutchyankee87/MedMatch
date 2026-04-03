import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { parseCvText } from '@/lib/cv-parser';

// POST /api/cv-parse - Parse CV text using Claude API
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cvText, cvUrl } = body;

    if (!cvText && !cvUrl) {
      return NextResponse.json({ error: 'Provide cvText or cvUrl' }, { status: 400 });
    }

    let textToParse = cvText;

    // If a URL is provided and no text, fetch and extract text from the PDF
    if (!textToParse && cvUrl) {
      // Validate URL against allowed Supabase storage domain to prevent SSRF
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
      }
      try {
        const parsedUrl = new URL(cvUrl);
        const allowedHost = new URL(supabaseUrl).host;
        if (parsedUrl.host !== allowedHost) {
          return NextResponse.json({ error: 'URL must point to application storage' }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
      }

      try {
        const response = await fetch(cvUrl);
        const arrayBuffer = await response.arrayBuffer();
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
        const textResult = await parser.getText();
        textToParse = textResult.text;
        await parser.destroy();
      } catch (error) {
        console.error('PDF extraction error:', error);
        return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 422 });
      }
    }

    if (!textToParse || textToParse.trim().length < 50) {
      return NextResponse.json({ error: 'CV text too short to parse' }, { status: 422 });
    }

    const result = await parseCvText(textToParse);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('CV parse error:', error);
    return NextResponse.json({ error: 'Failed to parse CV' }, { status: 500 });
  }
}
