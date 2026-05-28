import type { CalculatorInput } from './calculator';
import { defaultCalculatorInput } from './defaults';

type LegacyJson = Record<string, unknown>;

/**
 * Mescla JSON importado com defaults e converte campos legados.
 */
export function normalizeCalculatorInput(raw: LegacyJson): CalculatorInput {
  const base = structuredClone(defaultCalculatorInput);
  const legacyScenario = (raw.scenario ?? {}) as LegacyJson;
  const legacySac = (raw.sac ?? {}) as LegacyJson;

  const scenario = {
    ...base.scenario,
    ...legacyScenario,
  } as CalculatorInput['scenario'];

  if (
    'bulk_minutes_per_call' in legacyScenario &&
    !('bulk_seconds_per_call' in legacyScenario)
  ) {
    const minutes = Number(legacyScenario.bulk_minutes_per_call);
    if (Number.isFinite(minutes)) {
      scenario.bulk_seconds_per_call = minutes * 60;
    }
  }

  const sac = {
    ...base.sac,
    ...legacySac,
  } as CalculatorInput['sac'];

  if (typeof raw.sac_ponlink_status_seconds === 'number') {
    sac.seconds_per_call = raw.sac_ponlink_status_seconds;
  }

  return {
    scenario,
    massives: {
      ...base.massives,
      ...((raw.massives ?? {}) as object),
    },
    sac,
    api_live: {
      ...base.api_live,
      ...((raw.api_live ?? {}) as object),
    },
    provisioning: {
      ...base.provisioning,
      ...((raw.provisioning ?? {}) as object),
    },
    routines: Array.isArray(raw.routines)
      ? (raw.routines as CalculatorInput['routines'])
      : base.routines,
  };
}
