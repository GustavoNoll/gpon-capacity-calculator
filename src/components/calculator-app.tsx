'use client';

import { useMemo, useState } from 'react';
import { calculate, type CalculatorInput, type Routine } from '@/lib/calculator';
import { defaultCalculatorInput } from '@/lib/defaults';
import { labels } from '@/lib/labels';
import { normalizeCalculatorInput } from '@/lib/normalize-input';
import { NumberField } from './number-field';
import { ResultsPanel } from './results-panel';
import { SectionCard } from './section-card';

function cloneDefaults(): CalculatorInput {
  return structuredClone(defaultCalculatorInput);
}

export function CalculatorApp() {
  const [input, setInput] = useState<CalculatorInput>(cloneDefaults);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const result = useMemo(() => calculate(input), [input]);

  function updateScenario<K extends keyof CalculatorInput['scenario']>(
    key: K,
    value: CalculatorInput['scenario'][K],
  ) {
    setInput((prev) => ({
      ...prev,
      scenario: { ...prev.scenario, [key]: value },
    }));
  }

  function updateMassives<K extends keyof CalculatorInput['massives']>(
    key: K,
    value: CalculatorInput['massives'][K],
  ) {
    setInput((prev) => ({
      ...prev,
      massives: { ...prev.massives, [key]: value },
    }));
  }

  function updateSac<K extends keyof CalculatorInput['sac']>(
    key: K,
    value: CalculatorInput['sac'][K],
  ) {
    setInput((prev) => ({
      ...prev,
      sac: { ...prev.sac, [key]: value },
    }));
  }

  function updateApi<K extends keyof CalculatorInput['api_live']>(
    key: K,
    value: CalculatorInput['api_live'][K],
  ) {
    setInput((prev) => ({
      ...prev,
      api_live: { ...prev.api_live, [key]: value },
    }));
  }

  function updateProvisioning<
    K extends keyof CalculatorInput['provisioning'],
  >(key: K, value: CalculatorInput['provisioning'][K]) {
    setInput((prev) => ({
      ...prev,
      provisioning: { ...prev.provisioning, [key]: value },
    }));
  }

  function updateRoutine(
    index: number,
    field: keyof Routine,
    value: string | number,
  ) {
    setInput((prev) => {
      const routines = [...prev.routines];
      routines[index] = { ...routines[index], [field]: value };
      return { ...prev, routines };
    });
  }

  function addRoutine() {
    setInput((prev) => ({
      ...prev,
      routines: [
        ...prev.routines,
        { name: 'nova_rotina', every_minutes: 60, p90_seconds: 10 },
      ],
    }));
  }

  function removeRoutine(index: number) {
    setInput((prev) => ({
      ...prev,
      routines: prev.routines.filter((_, i) => i !== index),
    }));
  }

  function resetDefaults() {
    setInput(cloneDefaults());
    setJsonDraft('');
    setJsonError(null);
  }

  function exportJson() {
    setJsonDraft(JSON.stringify(input, null, 2));
    setJsonError(null);
    setShowAdvanced(true);
  }

  function importJson() {
    try {
      const parsed = JSON.parse(jsonDraft) as Record<string, unknown>;
      if (!parsed.scenario || !parsed.routines) {
        throw new Error('JSON inválido: faltam cenário ou rotinas');
      }
      setInput(normalizeCalculatorInput(parsed));
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : 'JSON inválido');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Calculadora de capacidade GPON
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          OLTs:{' '}
          <span className="font-semibold text-[var(--foreground)]">
            {input.scenario.olts}
          </span>
          {' · '}
          Estimativa de threads para bulk, massivas, rotinas, SAC, API e
          provisionamento (por OLT).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetDefaults}
            className="rounded-md border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium hover:border-[var(--accent)]"
          >
            Restaurar padrões
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="rounded-md border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium hover:border-[var(--accent)]"
          >
            Exportar JSON
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
          >
            {showAdvanced ? 'Ocultar avançado' : 'Opções avançadas'}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionCard
            title="Cenário"
            description="Parâmetros gerais da rede e bulk contínuo"
          >
            <NumberField
              label={labels.scenario.olts}
              value={input.scenario.olts}
              onChange={(v) => updateScenario('olts', v)}
              min={1}
            />
            <NumberField
              label={labels.scenario.ponlinks_per_olt}
              value={input.scenario.ponlinks_per_olt}
              onChange={(v) => updateScenario('ponlinks_per_olt', v)}
              min={1}
            />
            <NumberField
              label={labels.scenario.bulk_batch_size}
              value={input.scenario.bulk_batch_size}
              onChange={(v) => updateScenario('bulk_batch_size', v)}
              min={1}
            />
            <NumberField
              label={labels.scenario.bulk_seconds_per_call}
              value={input.scenario.bulk_seconds_per_call}
              onChange={(v) => updateScenario('bulk_seconds_per_call', v)}
              step={1}
              min={0}
              hint="Duração média de cada chamada bulk"
            />
            <NumberField
              label={labels.scenario.limit_threads_per_agent}
              value={input.scenario.limit_threads_per_agent}
              onChange={(v) => updateScenario('limit_threads_per_agent', v)}
              step={1}
              min={1}
              hint="Se total passar desse limite, divide em mais agents"
            />
          </SectionCard>

          <SectionCard
            title="Massivas"
            description="Gatilhos de massivas e tempo por chamada"
          >
            <NumberField
              label={labels.massives.per_day}
              value={input.massives.per_day}
              onChange={(v) => updateMassives('per_day', v)}
              step={0.01}
              min={0}
            />
            <NumberField
              label={labels.massives.calls_per_massive}
              value={input.massives.calls_per_massive}
              onChange={(v) => updateMassives('calls_per_massive', v)}
              step={0.1}
              min={0}
            />
            <NumberField
              label={labels.massives.seconds_per_call}
              value={input.massives.seconds_per_call}
              onChange={(v) => updateMassives('seconds_per_call', v)}
              step={0.01}
              min={0}
            />
          </SectionCard>

          <SectionCard title="SAC" description="Tráfego ao vivo do SAC">
            <NumberField
              label={labels.sac.active_users}
              value={input.sac.active_users}
              onChange={(v) => updateSac('active_users', v)}
              min={0}
            />
            <NumberField
              label={labels.sac.req_per_user_min}
              value={input.sac.req_per_user_min}
              onChange={(v) => updateSac('req_per_user_min', v)}
              step={0.1}
              min={0}
            />
            <NumberField
              label={labels.sac.seconds_per_call}
              value={input.sac.seconds_per_call}
              onChange={(v) => updateSac('seconds_per_call', v)}
              step={0.01}
              min={0}
              hint="Ex.: consulta de status do PON link"
            />
          </SectionCard>

          <SectionCard
            title="API ao vivo"
            description="Tráfego da API em tempo real"
          >
            <NumberField
              label={labels.api_live.req_per_min}
              value={input.api_live.req_per_min}
              onChange={(v) => updateApi('req_per_min', v)}
              step={0.1}
              min={0}
            />
            <NumberField
              label={labels.api_live.seconds_per_call}
              value={input.api_live.seconds_per_call}
              onChange={(v) => updateApi('seconds_per_call', v)}
              step={0.01}
              min={0}
            />
          </SectionCard>

          <SectionCard
            title="Provisionamento"
            description="Técnicos simultâneos; um técnico = um fluxo em voo"
          >
            <NumberField
              label={labels.provisioning.simultaneous_techs}
              value={input.provisioning.simultaneous_techs}
              onChange={(v) => updateProvisioning('simultaneous_techs', v)}
              min={0}
            />
            <NumberField
              label={labels.provisioning.seconds_per_call}
              value={input.provisioning.seconds_per_call}
              onChange={(v) => updateProvisioning('seconds_per_call', v)}
              step={1}
              min={0}
              hint="Duração média de cada provisionamento (referência)"
            />
          </SectionCard>

          {showAdvanced ? (
            <div className="space-y-4">
              <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Rotinas OLT</h2>
                    <p className="text-xs text-[var(--muted)]">
                      Intervalo e P90 de cada rotina por OLT
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addRoutine}
                    className="rounded border border-[var(--card-border)] px-2 py-1 text-xs hover:border-[var(--accent)]"
                  >
                    + rotina
                  </button>
                </div>
                <div className="space-y-3">
                  {input.routines.map((r, i) => (
                    <div
                      key={`${r.name}-${i}`}
                      className="rounded border border-[var(--card-border)]/60 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={r.name}
                          onChange={(e) =>
                            updateRoutine(i, 'name', e.target.value)
                          }
                          className="font-mono text-sm"
                          aria-label="Nome da rotina"
                        />
                        <button
                          type="button"
                          onClick={() => removeRoutine(i)}
                          className="text-xs text-red-400 hover:underline"
                          disabled={input.routines.length <= 1}
                        >
                          remover
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <NumberField
                          label={labels.routines.every_minutes}
                          value={r.every_minutes}
                          onChange={(v) =>
                            updateRoutine(i, 'every_minutes', v)
                          }
                          step={1}
                          min={0.1}
                        />
                        <NumberField
                          label={labels.routines.p90_seconds}
                          value={r.p90_seconds}
                          onChange={(v) => updateRoutine(i, 'p90_seconds', v)}
                          step={0.01}
                          min={0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                <h2 className="mb-1 text-sm font-semibold">
                  Importar / exportar cenário
                </h2>
                <p className="mb-2 text-xs text-[var(--muted)]">
                  Cole ou edite o JSON completo (todos os parâmetros de uma vez).
                </p>
                <textarea
                  value={jsonDraft}
                  onChange={(e) => setJsonDraft(e.target.value)}
                  rows={10}
                  className="w-full rounded border border-[var(--card-border)] bg-[#0c0f14] p-2 font-mono text-xs"
                  placeholder='{"scenario": {...}, "massives": {...}, ...}'
                />
                {jsonError ? (
                  <p className="mt-1 text-xs text-red-400">{jsonError}</p>
                ) : null}
                <button
                  type="button"
                  onClick={importJson}
                  className="mt-2 rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
                >
                  Aplicar JSON
                </button>
              </section>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Resultados
          </h2>
          <ResultsPanel input={input} result={result} />
        </aside>
      </div>

      <footer className="mt-10 border-t border-[var(--card-border)] pt-4 text-center text-xs text-[var(--muted)]">
        Baseado em{' '}
        <code className="text-[var(--foreground)]">
          gpon_capacity_calculator.py
        </code>
      </footer>
    </div>
  );
}
