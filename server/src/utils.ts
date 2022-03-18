import { Hue, HueUPNPResponse, Lamp } from "hue-hacking-node";
import { HUE_USERNAME, STEP_INTERVAL_MS } from "./config";

const getHueUsername = () => {
  if (typeof HUE_USERNAME !== "string" || HUE_USERNAME.length === 0) {
    throw new Error("HUE_USERNAME env not set #ftXIkK");
  }

  return HUE_USERNAME;
};

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

let hue: Hue;

export const getHue = async ({ HUE_USERNAME }: { HUE_USERNAME?: string }) => {
  if (typeof HUE_USERNAME !== "string" || HUE_USERNAME.length === 0) {
    throw new Error(
      `Missing HUE_USERNAME (did you set it as an Authorization header?) #crcChF`
    );
  }

  if (!hue) {
    const ip = await getBridgeIp();
    hue = new Hue({
      ip,
      key: HUE_USERNAME,
    });
  }

  return hue;
};

let lamps: Lamp[];

// NOTE: The `hue-hacking-node` package calls them Lamps, but Hue calls them
// lights, so we use the Hue naming and wrap the underlying methods.
export const getLights = async (hue: Hue) => {
  return hue.getLamps();
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
