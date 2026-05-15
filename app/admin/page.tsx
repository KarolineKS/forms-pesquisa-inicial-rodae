'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [stats, setStats] = useState<{ total: number; completed: number; blocked: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadStats() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/responses/export?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        setError('Token inválido ou erro no servidor.');
        setStats(null);
        return;
      }
      const data = await res.json();
      const total = data.count || 0;
      const completed = data.responses.filter((r: any) => r.completed).length;
      const blocked = data.responses.filter((r: any) => r.blocked).length;
      setStats({ total, completed, blocked });
    } catch (e: any) {
      setError(e?.message || 'Erro');
    } finally {
      setLoading(false);
    }
  }

  function downloadCSV() {
    window.location.href = `/api/responses/export?format=csv&token=${encodeURIComponent(token)}`;
  }
  function downloadJSON() {
    window.location.href = `/api/responses/export?format=json&token=${encodeURIComponent(token)}`;
  }

  return (
    <main className="max-w-md mx-auto px-5 py-16">
      <p className="label mb-4">Painel admin</p>
      <h1 className="font-serif text-3xl mb-8">Respostas da pesquisa</h1>

      <div className="surface p-6 mb-4">
        <label className="label block mb-2">Token de acesso</label>
        <input
          type="password"
          className="w-full px-4 py-3 text-[15px] mb-3"
          placeholder="Cole o ADMIN_TOKEN"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button className="btn-primary w-full py-3 text-sm" onClick={loadStats} disabled={!token || loading}>
          {loading ? 'Carregando…' : 'Entrar / atualizar'}
        </button>
        {error && <p className="text-sm text-[var(--error)] mt-3">{error}</p>}
      </div>

      {stats && (
        <>
          <div className="surface p-6 mb-4">
            <p className="text-sm text-[var(--ink-soft)]">
              Total: <strong>{stats.total}</strong> · Completas: <strong>{stats.completed}</strong> · Bloqueadas: <strong>{stats.blocked}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <button className="btn-primary w-full py-3 text-sm" onClick={downloadCSV}>
              Baixar CSV
            </button>
            <button className="btn-ghost w-full py-3 text-sm border border-[var(--border)]" onClick={downloadJSON}>
              Baixar JSON
            </button>
          </div>
        </>
      )}
    </main>
  );
}
