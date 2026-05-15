import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers = body.answers || {};
    const completed = !!body.completed;
    const blocked = !!body.blocked;

    const age = answers.P0 ?? null;
    const city = answers.F1 ?? null;
    const whatsapp = answers.F2 ?? null;

    const ua = req.headers.get('user-agent') || null;
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null;

    const rows = await sql`
      INSERT INTO survey_responses (completed, blocked, age, city, whatsapp, answers, user_agent, ip)
      VALUES (${completed}, ${blocked}, ${age}, ${city}, ${whatsapp}, ${JSON.stringify(answers)}::jsonb, ${ua}, ${ip})
      RETURNING id, created_at
    `;

    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (e: any) {
    console.error('POST /api/responses error:', e);
    return NextResponse.json({ ok: false, error: e?.message || 'Erro' }, { status: 500 });
  }
}
