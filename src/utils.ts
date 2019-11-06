import { Hue, Lamp, HueUPNPResponse } from "hue-hacking-node";

import { HUE_USERNAME } from "./config/private";

export const getBridgeIp = async () => {
  const foundBridges: HueUPNPResponse[] = await Hue.search();

  if (foundBridges.length !== 1) {
    console.error("Failed to find bridges #t83u5l", foundBridges);
    throw new Error("Failed to find exactly one bridge #JMvJyo");
  }

  return foundBridges[0].internalipaddress;
};

let hue: Hue;

export const getHue = async () => {
  if (!hue) {
    const ip = await getBridgeIp();
    hue = new Hue({
      ip,
      key: HUE_USERNAME
    });
  }

  return hue;
};

type LampWithIndex = Lamp & {
  hueIndex: number;
};
const addIndexToLamp = (lamp: Lamp, index: number): LampWithIndex => {
  // NOTE: We add 1 to the `index` because the array is zero indexed by the Hue
  // result and operations are all 1 indexed.
  return { ...lamp, hueIndex: index + 1 };
};

let lamps: LampWithIndex[];

// NOTE: The `hue-hacking-node` package calls them Lamps, but Hue calls them
// lights, so we use the Hue naming and wrap the underlying methods.
export const getLights = async () => {
  const hue = await getHue();
  if (!lamps) {
    lamps = (await hue.getLamps()).map(addIndexToLamp);
  }

  return lamps;
};
