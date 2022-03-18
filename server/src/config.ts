export const HUE_USERNAME =
  "HUE_USERNAME" in process.env ? process.env.HUE_USERNAME : undefined;

// export const TARGET_COLOUR = colours.rgbToCIE1931(new RGB(255, 0, 0));
// export const TARGET_COLOUR = colours.getCIEColor("darkred");

export const STEP_INTERVAL_MS =
  "STEP_INTERVAL_MS" in process.env
    ? parseInt(process.env.STEP_INTERVAL_MS)
    : 10 * 1e3; // seconds
