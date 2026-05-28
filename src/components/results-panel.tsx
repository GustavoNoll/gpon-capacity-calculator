import type { CalculatorInput, CalculatorResult } from '@/lib/calculator';

function fmt(n: number, digits = 2): string {
  return n.toFixed(digits);
}

type ResultsPanelProps = {
  input: CalculatorInput;
  result: CalculatorResult;
};

export function ResultsPanel({ input, result }: ResultsPanelProps) {
  const { scenario, massives, sac, api_live, provisioning } = input;
  const { summary } = result;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold">Bulk contínuo</h2>
        <dl className="grid gap-1 text-xs sm:grid-cols-2">
          <Row label="ponlinks_per_olt" value={scenario.ponlinks_per_olt} />
          <Row label="batch_size" value={scenario.bulk_batch_size} />
          <Row label="calls/day" value={fmt(result.bulk.callsPerDay)} />
          <Row label="req/min" value={fmt(result.bulk.reqPerMin)} />
          <Row
            label="threads"
            value={fmt(result.bulk.threads)}
            highlight
          />
        </dl>
      </section>

      <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold">Massives trigger</h2>
        <dl className="grid gap-1 text-xs sm:grid-cols-2">
          <Row label="massives/day" value={fmt(massives.per_day)} />
          <Row label="calls/day" value={fmt(result.massives.callsPerDay)} />
          <Row label="req/min" value={fmt(result.massives.reqPerMin)} />
          <Row
            label="seconds_per_call"
            value={fmt(massives.seconds_per_call)}
          />
          <Row
            label="threads"
            value={fmt(result.massives.threads)}
            highlight
          />
        </dl>
      </section>

      <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold">Rotinas OLT</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-[var(--muted)]">
                <th className="pb-2 pr-2 font-medium">Rotina</th>
                <th className="pb-2 pr-2 font-medium">every (min)</th>
                <th className="pb-2 pr-2 font-medium">calls/day</th>
                <th className="pb-2 pr-2 font-medium">req/min</th>
                <th className="pb-2 pr-2 font-medium">p90 (s)</th>
                <th className="pb-2 font-medium">threads</th>
              </tr>
            </thead>
            <tbody>
              {result.routines.map((r) => (
                <tr
                  key={r.name}
                  className="border-b border-[var(--card-border)]/50"
                >
                  <td className="py-1.5 pr-2 font-mono">{r.name}</td>
                  <td className="py-1.5 pr-2">{fmt(r.every_minutes, 0)}</td>
                  <td className="py-1.5 pr-2">{fmt(r.callsPerDay)}</td>
                  <td className="py-1.5 pr-2">{fmt(r.reqPerMin)}</td>
                  <td className="py-1.5 pr-2">{fmt(r.p90_seconds)}</td>
                  <td className="py-1.5 font-medium text-[var(--accent)]">
                    {fmt(r.threads)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Total rotinas:{' '}
          <span className="font-semibold text-[var(--foreground)]">
            {fmt(result.routinesTotalThreads)} threads
          </span>
        </p>
      </section>

      <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold">Provisioning</h2>
        <p className="mb-2 text-xs text-[var(--muted)]">
          Premissa: um técnico = um provisionamento em voo.
        </p>
        <dl className="grid gap-1 text-xs sm:grid-cols-2">
          <Row
            label="simultaneous_techs"
            value={provisioning.simultaneous_techs}
          />
          <Row
            label="threads"
            value={fmt(result.provisioningThreads)}
            highlight
          />
        </dl>
      </section>

      <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold">SAC</h2>
        <dl className="grid gap-1 text-xs sm:grid-cols-2">
          <Row label="active_users" value={sac.active_users} />
          <Row label="req/min" value={fmt(result.sac.reqPerMin)} />
          <Row
            label="operational_seconds"
            value={fmt(input.sac_ponlink_status_seconds)}
          />
          <Row label="threads" value={fmt(result.sac.threads)} highlight />
        </dl>
      </section>

      <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold">API ao vivo</h2>
        <dl className="grid gap-1 text-xs sm:grid-cols-2">
          <Row label="req/min" value={fmt(api_live.req_per_min)} />
          <Row
            label="seconds_per_call"
            value={fmt(api_live.seconds_per_call)}
          />
          <Row label="threads" value={fmt(result.api.threads)} highlight />
        </dl>
      </section>

      <section className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-muted)]/30 p-4">
        <h2 className="mb-3 text-sm font-semibold">Resumo</h2>
        <dl className="grid gap-1.5 text-xs">
          <SummaryRow
            label="bulk_continuous_threads"
            value={summary.bulkContinuousThreads}
          />
          <SummaryRow
            label="massives_threads"
            value={summary.massivesThreads}
          />
          <SummaryRow
            label="routines_threads"
            value={summary.routinesThreads}
          />
          <SummaryRow
            label="provisioning_threads"
            value={summary.provisioningThreads}
          />
          <SummaryRow label="sac_threads" value={summary.sacThreads} />
          <SummaryRow label="api_threads" value={summary.apiThreads} />
          <div className="mt-2 border-t border-[var(--card-border)] pt-2">
            <SummaryRow
              label="total_threads"
              value={summary.totalThreads}
              large
            />
          </div>
          <p className="mt-2 text-[var(--muted)]">
            SAC: {fmt(summary.sacSharePct, 1)}% do total · API:{' '}
            {fmt(summary.apiSharePct, 1)}% do total
          </p>
        </dl>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <>
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd
        className={
          highlight ? 'font-semibold text-[var(--accent)]' : 'font-mono'
        }
      >
        {value}
      </dd>
    </>
  );
}

function SummaryRow({
  label,
  value,
  large,
}: {
  label: string;
  value: number;
  large?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span
        className={`font-mono font-semibold ${large ? 'text-lg text-[var(--accent)]' : ''}`}
      >
        {fmt(value)}
      </span>
    </div>
  );
}
