export const STEP_INTERVAL_MS =
  "STEP_INTERVAL_MS" in process.env
    ? parseInt(process.env.STEP_INTERVAL_MS)
    : 10 * 1e3; // seconds
