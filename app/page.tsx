'use client';

import { useEffect, useMemo, useState } from 'react';
import { QUESTIONS, Question } from '@/lib/questions';

type Answers = Record<string, any>;

export default function Page() {
  const [screen, setScreen] = useState<'welcome' | 'survey' | 'thanks' | 'blocked'>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [history, setHistory] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copiar link');

  const q = QUESTIONS[currentIndex];

  const visibleQuestions = useMemo(
    () => QUESTIONS.filter((qq) => !qq.showIf || qq.showIf(answers)),
    [answers]
  );

  const currentVisibleIndex = visibleQuestions.findIndex((vq) => vq.id === q?.id);
  const total = visibleQuestions.length;
  const progress =
    screen === 'survey' && total > 0
      ? ((currentVisibleIndex + 1) / total) * 100
      : screen === 'thanks'
      ? 100
      : 0;

  function findNextVisibleIndex(fromIndex: number, current: Answers): number {
    for (let i = fromIndex; i < QUESTIONS.length; i++) {
      const qq = QUESTIONS[i];
      if (!qq.showIf || qq.showIf(current)) return i;
    }
    return -1;
  }

  useEffect(() => {
    if (screen === 'survey' && q?.showIf && !q.showIf(answers)) {
      const next = findNextVisibleIndex(currentIndex + 1, answers);
      if (next === -1) finishSurvey();
      else setCurrentIndex(next);
    }
  }, [currentIndex, screen]);

  function startSurvey() {
    setScreen('survey');
    setCurrentIndex(0);
  }

  function selectOption(qid: string, value: string, blocking?: boolean) {
    const newAnswers = { ...answers, [qid]: value };
    setAnswers(newAnswers);
    if (blocking) {
      void submit(newAnswers, { blocked: true });
      setScreen('blocked');
      return;
    }
    setTimeout(() => goNext(newAnswers), 240);
  }

  function selectScale(qid: string, value: number) {
    setAnswers((a) => ({ ...a, [qid]: value }));
  }

  function updateText(qid: string, value: string) {
    setAnswers((a) => ({ ...a, [qid]: value }));
  }

  function goNext(currentAnswers?: Answers) {
    const a = currentAnswers || answers;
    if (!q) return;
    const val = a[q.id];
    if (!q.optional && (val === undefined || val === '')) return;

    const next = findNextVisibleIndex(currentIndex + 1, a);
    setHistory((h) => [...h, currentIndex]);
    if (next === -1) {
      finishSurvey(a);
    } else {
      setCurrentIndex(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentIndex(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(data: Answers, meta: { blocked?: boolean; completed?: boolean } = {}) {
    setSubmitting(true);
    try {
      await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: data,
          completed: !!meta.completed,
          blocked: !!meta.blocked,
        }),
      });
    } catch (e) {
      console.error('Erro ao enviar:', e);
    } finally {
      setSubmitting(false);
    }
  }

  function finishSurvey(currentAnswers?: Answers) {
    const finalAnswers = currentAnswers || answers;
    void submit(finalAnswers, { completed: true });
    setScreen('thanks');
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyLabel('Link copiado');
      setTimeout(() => setCopyLabel('Copiar link'), 2000);
    });
  }

  const isLast = q && findNextVisibleIndex(currentIndex + 1, answers) === -1;
  const hasAnswer = q ? answers[q.id] !== undefined && answers[q.id] !== '' : false;
  const canProceed = q ? q.optional || hasAnswer : false;

  return (
    <>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <main className="max-w-2xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-24 relative z-10">
        {screen === 'welcome' && <Welcome onStart={startSurvey} />}

        {screen === 'survey' && q && (
          <section>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] tabular-nums text-[var(--ink)]">
                  {String(currentVisibleIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-[var(--muted-light)] text-xs">/</span>
                <span className="text-[13px] tabular-nums text-[var(--muted)]">
                  {String(total).padStart(2, '0')}
                </span>
              </div>
              <span className="label">
                {currentVisibleIndex + 1 < total
                  ? `${total - currentVisibleIndex - 1} ${total - currentVisibleIndex - 1 === 1 ? 'restante' : 'restantes'}`
                  : 'Última pergunta'}
              </span>
            </div>

            <div className="question" key={q.id}>
              <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.12] mb-3 text-balance">
                {q.text}
              </h2>

              {q.subtext && (
                <p className="text-[15px] text-[var(--muted)] mb-7 leading-relaxed">{q.subtext}</p>
              )}
              {q.optional && !q.subtext && (
                <p className="text-[12px] text-[var(--muted)] mb-7 tracking-wide uppercase font-medium">
                  Opcional
                </p>
              )}
              {!q.subtext && !q.optional && <div className="mb-8" />}
              {q.subtext && <div className="mb-1" />}

              <QuestionInput
                q={q}
                value={answers[q.id]}
                onSelectOption={(value, blocking) => selectOption(q.id, value, blocking)}
                onSelectScale={(value) => selectScale(q.id, value)}
                onChangeText={(value) => updateText(q.id, value)}
              />
            </div>

            <div className="flex justify-between items-center mt-12 gap-3">
              <button
                className="btn-ghost px-4 py-2.5 text-sm"
                onClick={goBack}
                style={{ visibility: history.length === 0 ? 'hidden' : 'visible' }}
              >
                Voltar
              </button>
              <button
                className="btn-primary px-7 py-3.5 text-[14px]"
                onClick={() => goNext()}
                disabled={!canProceed || submitting}
              >
                {isLast ? (submitting ? 'Enviando' : 'Enviar resposta') : 'Continuar'}
              </button>
            </div>
          </section>
        )}

        {screen === 'thanks' && (
          <Thanks
            hasWhats={!!(answers.F2 && String(answers.F2).length > 0)}
            copyLabel={copyLabel}
            onCopy={copyLink}
          />
        )}

        {screen === 'blocked' && <Blocked copyLabel={copyLabel} onCopy={copyLink} />}
      </main>
    </>
  );
}

/* ─────────────────── Components ─────────────────── */


function QuestionInput({
  q,
  value,
  onSelectOption,
  onSelectScale,
  onChangeText,
}: {
  q: Question;
  value: any;
  onSelectOption: (value: string, blocking?: boolean) => void;
  onSelectScale: (value: number) => void;
  onChangeText: (value: string) => void;
}) {
  if (q.type === 'single') {
    return (
      <div className="space-y-2">
        {q.options!.map((opt, i) => {
          const selected = value === opt.value;
          return (
            <div
              key={opt.value}
              className={`option p-4 md:p-[18px] flex items-center gap-3.5 ${selected ? 'selected' : ''}`}
              onClick={() => onSelectOption(opt.value, opt.blocking)}
              style={{ animation: `fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.035}s backwards` }}
            >
              <div className="indicator" />
              <span className="text-[15px] leading-snug">{opt.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (q.type === 'scale') {
    return (
      <div className="fade-in">
        <div className="grid grid-cols-11 gap-1.5 md:gap-2">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`scale-btn aspect-square flex items-center justify-center text-sm md:text-[15px] ${value === i ? 'selected' : ''}`}
              onClick={() => onSelectScale(i)}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-3 px-1 text-[11px] uppercase tracking-wider text-[var(--muted)] font-medium">
          <span>Péssimo</span>
          <span className="hidden sm:inline">Neutro</span>
          <span>Excelente</span>
        </div>
      </div>
    );
  }

  if (q.type === 'textarea') {
    return (
      <div className="fade-in">
        <textarea
          className="w-full px-4 py-3.5 text-[15px] min-h-36 resize-y leading-relaxed"
          placeholder={q.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChangeText(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <input
        type={q.type}
        className="w-full px-4 py-3.5 text-[15px]"
        placeholder={q.placeholder || ''}
        value={value || ''}
        onChange={(e) => onChangeText(e.target.value)}
      />
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="fade-in">
      <h1 className="text-[2.4rem] md:text-[3.2rem] leading-[1.06] mb-8 text-balance">
        Pesquisa sobre hábitos de uso de veículos (carros e motos)
      </h1>

      <div className="space-y-4 text-[16px] md:text-[17px] text-[var(--ink-soft)] leading-relaxed mb-10 max-w-xl">
        <p>
          Olá! Estamos realizando um estudo sobre como os moradores de Pelotas,
          Santa Maria e Rio Grande buscam e utilizam veículos no dia a dia.
        </p>
        <p>
          Se você já alugou ou teve interesse em alugar um carro ou moto, mesmo
          que elétrica, sua opinião é muito valiosa.
        </p>
      </div>

      <div className="prize-card mb-10">
        <div>
          <p className="text-[1.5rem] md:text-[1.75rem] font-semibold leading-tight text-[var(--ink)] mb-1.5">
            Concorra a R$ 100 via PIX
          </p>
          <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed">
            Quem responder e deixar o WhatsApp ao final entra no sorteio.
            O vencedor é avisado no dia <strong className="font-semibold text-[var(--ink)]">23/05</strong>.
          </p>
        </div>
      </div>

      <button type="button" className="btn-cta" onClick={onStart}>
        <span>Iniciar pesquisa</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </section>
  );
}

function Thanks({ hasWhats, copyLabel, onCopy }: { hasWhats: boolean; copyLabel: string; onCopy: () => void }) {
  return (
    <section className="fade-in">
      <div className="mb-10">
        <p className="label mb-8">Resposta registrada</p>
        <h2 className="text-[2.6rem] md:text-[3.4rem] leading-[1.05] mb-5 text-balance">
          Obrigada pela sua contribuição
        </h2>
        <p className="text-[17px] text-[var(--ink-soft)] leading-relaxed max-w-lg">
          Sua resposta já faz parte deste estudo. Cada participação ajuda a entender melhor a mobilidade no
          interior do Rio Grande do Sul.
        </p>
      </div>

      <div className="surface p-6 md:p-7 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="label">Sorteio</p>
          <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--accent)]">23 / 05</span>
        </div>
        <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
          {hasWhats
            ? 'Você está concorrendo. Caso seja a pessoa sorteada, será avisada pelo WhatsApp na data do sorteio.'
            : 'Você não deixou o WhatsApp e não entrou no sorteio desta vez. Sua resposta foi registrada normalmente.'}
        </p>
      </div>

      <div className="surface p-6 md:p-7 mb-8">
        <p className="label mb-2">Compartilhar</p>
        <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
          Se conhece pessoas no Rio Grande do Sul que poderiam contribuir, encaminhar o link aumenta a
          representatividade do estudo.
        </p>
      </div>

      <button className="btn-primary w-full py-4 md:py-[18px] text-[15px]" onClick={onCopy}>
        {copyLabel}
      </button>
    </section>
  );
}

function Blocked({ copyLabel, onCopy }: { copyLabel: string; onCopy: () => void }) {
  return (
    <section className="fade-in">
      <div className="mb-10">
        <p className="label mb-8">Participação encerrada</p>
        <h2 className="text-[2.6rem] md:text-[3.4rem] leading-[1.05] mb-5 text-balance">
          Obrigada por passar por aqui
        </h2>
        <p className="text-[16px] text-[var(--ink-soft)] leading-relaxed mb-3">
          A pesquisa está restrita a participantes maiores de 18 anos.
        </p>
        <p className="text-[16px] text-[var(--ink-soft)] leading-relaxed">
          Se conhece alguém que pode contribuir, encaminhar o link ainda faz diferença para o estudo.
        </p>
      </div>

      <button className="btn-primary w-full py-4 md:py-[18px] text-[15px]" onClick={onCopy}>
        {copyLabel}
      </button>
    </section>
  );
}
