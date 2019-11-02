import { Hue, HueUPNPResponse, Lamp, XYPoint } from "hue-hacking-node";
import eachSeries from "async/eachSeries";

import { HUE_USERNAME } from "../config/private";

const DEBUG = true;

const TARGET_LIGHTS = [
  "Right Light",
  "Left Light",
  "White Stand Light",
  "Black Stand Light"
];

const getBridgeIp = async () => {
  const foundBridges: HueUPNPResponse[] = await Hue.search();

  if (foundBridges.length !== 1) {
    console.error("Failed to find bridges #t83u5l", foundBridges);
    throw new Error("Failed to find exactly one bridge #JMvJyo");
  }

  return foundBridges[0].internalipaddress;
};

let hue: Hue;

const getHue = async () => {
  if (!hue) {
    const ip = await getBridgeIp();
    hue = new Hue({
      ip,
      key: HUE_USERNAME
    });
  }

  return hue;
};

let lamps: Lamp[];

const getLamps = async () => {
  const hue = await getHue();
  if (!lamps) {
    lamps = await hue.getLamps();
  }
  return lamps;
};

const getLightIndexesByNamees = async (names: string[]): Promise<number[]> => {
  const lights = await getLamps();

  const indexes = names.reduce((final: number[], name): number[] => {
    const index = lights.findIndex(light => {
      return light.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
    });
    if (index !== -1) {
      // The array is zero indexed but hue is 1 indexed, so add 1 here
      return final.concat(index + 1);
    }
    return final;
  }, []);

  if (indexes.length === 0) {
    throw new Error("Failed to find lights #ckxRtG");
  }

  console.log("Got light indexes #XljJyD");
  indexes.forEach(index => {
    console.log("Light state #qQ5v49", lights[index - 1].state);
  });

  return indexes;
};

const getLampByHueIndex = async (hueIndex: number): Promise<Lamp> => {
  const lamps = await getLamps();
  const lamp = lamps[hueIndex - 1];
  if (!lamp) {
    throw new Error(`Could not find lamp #akrrNk, hueIndex: ${hueIndex}`);
  }
  return lamp;
};

const getLampColour = async (hueIndex: number) => {
  const lamp = await getLampByHueIndex(hueIndex);

  if (DEBUG) console.log("lamp colour #1cHx7a", lamp.state.xy, lamp.state.bri);

  if (!!lamp.state.xy && !!lamp.state.bri) {
    return hue.colors.CIE1931ToRGB(
      new XYPoint(lamp.state.xy[0], lamp.state.xy[1]),
      lamp.state.bri
    );
  }
  throw new Error("Lamp has no colour #FncbSE");
};

const start = async () => {
  const hue = await getHue();

  const targetIndexes = await getLightIndexesByNamees(TARGET_LIGHTS);
  console.log("targetIndex", targetIndexes);
  // await hue.turnOff(targetIndex);
  // console.log("offed");

  await eachSeries(targetIndexes, async index => {
    // await hue.flash(index);
    const colour = await getLampColour(index);
    console.log("Current colour #oTYDwI", index, colour);
    // console.log("Flashed #gzcUwE", index);
  });

  // hue.setColor(targetIndex, "red");
  // console.log("red");

  // console.log("args", process.argv);
};

const run = async () => {
  try {
    await start();
  } catch (err) {
    console.error("Error #HuomZL", err);
    process.exit();
  }
};

run();
