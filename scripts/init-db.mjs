import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local');
try {
  const env = readFileSync(envPath, 'utf8');
  env.split('\n').forEach((line) => {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
} catch {}

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS survey_responses (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE,
    blocked BOOLEAN DEFAULT FALSE,
    age TEXT,
    city TEXT,
    whatsapp TEXT,
    answers JSONB NOT NULL,
    user_agent TEXT,
    ip TEXT
  )
`;

await sql`CREATE INDEX IF NOT EXISTS idx_survey_created_at ON survey_responses(created_at DESC)`;
await sql`CREATE INDEX IF NOT EXISTS idx_survey_completed ON survey_responses(completed)`;

console.log('✓ Tabela survey_responses pronta');
const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM survey_responses`;
console.log(`  Respostas atuais: ${count}`);
