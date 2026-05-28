export const MINUTES_PER_DAY = 1440.0;

export type Scenario = {
  olts: number;
  ponlinks_per_olt: number;
  bulk_batch_size: number;
  bulk_seconds_per_call: number;
  limit_threads_per_agent: number;
};

export type Massives = {
  per_day: number;
  calls_per_massive: number;
  seconds_per_call: number;
};

export type Sac = {
  active_users: number;
  req_per_user_min: number;
  seconds_per_call: number;
};

export type ApiLive = {
  req_per_min: number;
  seconds_per_call: number;
};

export type Provisioning = {
  simultaneous_techs: number;
  seconds_per_call: number;
};

export type Routine = {
  name: string;
  every_minutes: number;
  p90_seconds: number;
};

export type CalculatorInput = {
  scenario: Scenario;
  massives: Massives;
  sac: Sac;
  api_live: ApiLive;
  provisioning: Provisioning;
  routines: Routine[];
};

export function threadsFor(reqMin: number, secondsPerCall: number): number {
  return (reqMin * secondsPerCall) / 60.0;
}

export function reqMinForCalls(callsPerDay: number): number {
  return callsPerDay / MINUTES_PER_DAY;
}

export function callsPerDayForRoutine(
  olts: number,
  everyMinutes: number,
): number {
  const runsPerDayPerOlt = MINUTES_PER_DAY / everyMinutes;
  return olts * runsPerDayPerOlt;
}

export function pct(value: number, total: number): number {
  if (total <= 0) return 0.0;
  return (value / total) * 100.0;
}

export type BulkResult = {
  callsPerDay: number;
  reqPerMin: number;
  threads: number;
};

export type MassivesResult = {
  callsPerDay: number;
  reqPerMin: number;
  threads: number;
};

export type RoutineResult = Routine & {
  callsPerDay: number;
  reqPerMin: number;
  threads: number;
};

export type CalculatorResult = {
  olts: number;
  bulk: BulkResult;
  massives: MassivesResult;
  routines: RoutineResult[];
  routinesTotalThreads: number;
  provisioningThreads: number;
  sac: { reqPerMin: number; threads: number };
  api: { threads: number };
  summary: {
    bulkContinuousThreads: number;
    massivesThreads: number;
    routinesThreads: number;
    provisioningThreads: number;
    sacThreads: number;
    apiThreads: number;
    gponMinThreads: number;
    totalThreads: number;
    threadLimitPerAgent: number;
    agentsNeeded: number;
  };
};

export function calculate(input: CalculatorInput): CalculatorResult {
  const { scenario, massives, sac, api_live, provisioning, routines } = input;
  const olts = scenario.olts;

  const bulkCallsDay =
    (olts * scenario.ponlinks_per_olt) / scenario.bulk_batch_size;
  const bulkReqMin = reqMinForCalls(bulkCallsDay);
  const bulkThreads = threadsFor(
    bulkReqMin,
    scenario.bulk_seconds_per_call,
  );

  const massivesCallsDay = massives.per_day * massives.calls_per_massive;
  const massivesReqMin = reqMinForCalls(massivesCallsDay);
  const massivesThreads = threadsFor(
    massivesReqMin,
    massives.seconds_per_call,
  );

  const routineResults: RoutineResult[] = routines.map((r) => {
    const callsPerDay = callsPerDayForRoutine(olts, r.every_minutes);
    const reqPerMin = reqMinForCalls(callsPerDay);
    const threads = threadsFor(reqPerMin, r.p90_seconds);
    return { ...r, callsPerDay, reqPerMin, threads };
  });

  const routinesTotalThreads = routineResults.reduce(
    (sum, r) => sum + r.threads,
    0,
  );

  const provisioningThreads = provisioning.simultaneous_techs;

  const sacReqMin = sac.active_users * sac.req_per_user_min;
  const sacThreads = threadsFor(sacReqMin, sac.seconds_per_call);

  const apiThreads = threadsFor(api_live.req_per_min, api_live.seconds_per_call);

  const totalThreads =
    bulkThreads +
    massivesThreads +
    routinesTotalThreads +
    provisioningThreads +
    sacThreads +
    apiThreads;
  const gponMinThreads = provisioningThreads + sacThreads + apiThreads;

  const threadLimitPerAgent = Math.max(1, scenario.limit_threads_per_agent);
  const agentsNeeded = Math.ceil(totalThreads / threadLimitPerAgent);

  return {
    olts,
    bulk: {
      callsPerDay: bulkCallsDay,
      reqPerMin: bulkReqMin,
      threads: bulkThreads,
    },
    massives: {
      callsPerDay: massivesCallsDay,
      reqPerMin: massivesReqMin,
      threads: massivesThreads,
    },
    routines: routineResults,
    routinesTotalThreads,
    provisioningThreads,
    sac: { reqPerMin: sacReqMin, threads: sacThreads },
    api: { threads: apiThreads },
    summary: {
      bulkContinuousThreads: bulkThreads,
      massivesThreads,
      routinesThreads: routinesTotalThreads,
      provisioningThreads,
      sacThreads,
      apiThreads,
      gponMinThreads,
      totalThreads,
      threadLimitPerAgent,
      agentsNeeded,
    },
  };
}
