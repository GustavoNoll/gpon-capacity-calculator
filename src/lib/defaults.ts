import type { CalculatorInput } from './calculator';

/** Defaults mirrored from int6-isp-portal/scripts/gpon_capacity_calculator.py */
export const defaultCalculatorInput: CalculatorInput = {
  scenario: {
    olts: 200,
    ponlinks_per_olt: 256,
    bulk_batch_size: 5,
    bulk_seconds_per_call: 240.0,
  },
  massives: {
    per_day: 378.74,
    calls_per_massive: 4.0,
    seconds_per_call: 195.0,
  },
  sac: {
    active_users: 30,
    req_per_user_min: 3.0,
    seconds_per_call: 40.0,
  },
  api_live: {
    req_per_min: 60.0,
    seconds_per_call: 11.59,
  },
  provisioning: {
    simultaneous_techs: 10,
    seconds_per_call: 60.0,
  },
  routines: [
    { name: 'alarms', every_minutes: 5.0, p90_seconds: 10.87 },
    { name: 'olt_macs_table', every_minutes: 288.0, p90_seconds: 153.44 },
    { name: 'olt_info', every_minutes: 1440.0, p90_seconds: 295.48 },
    { name: 'fetch_resources', every_minutes: 1440.0, p90_seconds: 60.78 },
    {
      name: 'olt_get_running_cfg',
      every_minutes: 1440.0,
      p90_seconds: 610.83,
    },
    {
      name: 'olt_save_running_cfg',
      every_minutes: 1440.0,
      p90_seconds: 94.45,
    },
  ],
};
