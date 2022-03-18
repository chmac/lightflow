import { Hue, HueUPNPResponse, Lamp } from "hue-hacking-node";
import { STEP_INTERVAL_MS } from "./config";

export const getBridgeIp = async () => {
  if ("HUE_IP" in process.env) {
    return process.env.HUE_IP;
  }

  const foundBridges: HueUPNPResponse[] = await Hue.search();

  if (foundBridges.length !== 1) {
    console.error("Failed to find bridges #t83u5l", foundBridges);
    throw new Error("Failed to find exactly one bridge #JMvJyo");
  }

  return foundBridges[0].internalipaddress;
};

export const getHue = async ({ HUE_USERNAME }: { HUE_USERNAME?: string }) => {
  if (typeof HUE_USERNAME !== "string" || HUE_USERNAME.length === 0) {
    throw new Error(
      `Missing HUE_USERNAME (did you set it as an Authorization header?) #crcChF`
    );
  }

  const ip = await getBridgeIp();

  const hue = new Hue({
    ip,
    key: HUE_USERNAME,
  });

  return hue;
};

let lamps: Lamp[];

// NOTE: The `hue-hacking-node` package calls them Lamps, but Hue calls them
// lights, so we use the Hue naming and wrap the underlying methods.
export const getLights = async (hue: Hue) => {
  try {
    return hue.getLamps();
  } catch (error) {
    console.log(`getLights threw #lA46at`);
    console.log(error);
    throw error;
  }
  if (!lamps) {
    lamps = await hue.getLamps();
  }

  return lamps;
};

export const findLightByHueIndex = (lights: Lamp[], hueIndex: number) => {
  const light = lights.find(({ lampIndex }) => lampIndex === hueIndex);
  if (!light) {
    throw new Error("Failed to find light. #srh6sh");
  }
  return light;
};

export const getStepInterval = (timeMs: number): number => {
  return timeMs > 60e3 ? STEP_INTERVAL_MS : 2e3;
};
