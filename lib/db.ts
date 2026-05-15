import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL não configurada');
  _sql = neon(url);
  return _sql;
}

export const sql: NeonQueryFunction<false, false> = new Proxy(
  (() => {}) as any,
  {
    apply(_t, _thisArg, args) {
      return (getSql() as any)(...args);
    },
    get(_t, prop) {
      return (getSql() as any)[prop];
    },
  }
);
