import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { jsPDF } from 'npm:jspdf';

interface PdfRequest {
  title: string;
  content: string[];
  metadata?: Record<string, string>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const payload: PdfRequest = await req.json();
    const { title, content, metadata } = payload;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(title, 20, 20);

    doc.setFontSize(12);
    let y = 40;
    content.forEach((line) => {
      // Simple word wrap
      const splitLines = doc.splitTextToSize(line, 170);
      const lineHeight = 7;
      const blockHeight = lineHeight * splitLines.length;

      if (y + blockHeight > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(splitLines, 20, y);
      y += blockHeight;
    });

    if (metadata) {
       doc.setFontSize(10);
       doc.setTextColor(100);
       let metaY = 280;
       // If near bottom, add page
       if (y > 250) {
         doc.addPage();
         metaY = 280;
       }

       Object.entries(metadata).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 20, metaY);
          metaY -= 5;
       });
    }

    const pdfOutput = doc.output('arraybuffer');

    return new Response(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`,
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
