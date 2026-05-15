import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'edge';

function unauthorized() {
  return new NextResponse('Unauthorized', { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const provided =
    req.nextUrl.searchParams.get('token') ||
    req.headers.get('x-admin-token') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';
  return provided === token;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  const format = req.nextUrl.searchParams.get('format') || 'json';

  const rows = await sql`
    SELECT id, created_at, completed, blocked, age, city, whatsapp, answers, user_agent, ip
    FROM survey_responses
    ORDER BY created_at DESC
  `;

  if (format === 'csv') {
    const allKeys = new Set<string>();
    rows.forEach((r: any) => Object.keys(r.answers || {}).forEach((k) => allKeys.add(k)));
    const answerKeys = [...allKeys].sort();
    const headers = ['id', 'created_at', 'completed', 'blocked', 'city', 'whatsapp', 'user_agent', 'ip', ...answerKeys];

    const escape = (v: any) => {
      if (v === undefined || v === null) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n;]/.test(s) ? `"${s}"` : s;
    };

    let csv = headers.join(',') + '\n';
    for (const r of rows as any[]) {
      const row = [
        r.id,
        r.created_at,
        r.completed,
        r.blocked,
        r.city,
        r.whatsapp,
        r.user_agent,
        r.ip,
        ...answerKeys.map((k) => r.answers?.[k]),
      ];
      csv += row.map(escape).join(',') + '\n';
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="pesquisa-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ count: rows.length, responses: rows });
}
