import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
      },
      body: JSON.stringify({
        email: email,
        listIds: [5],
        updateEnabled: true,
        attributes: { SOURCE: 'waitlist' },
      }),
    });

    if (brevoRes.ok || brevoRes.status === 204) {
      return NextResponse.json({ success: true });
    }

    const brevoData = await brevoRes.json();

    if (brevoData.code === 'duplicate_parameter') {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}