import { Hue, HueUPNPResponse } from "hue-hacking-node";
import eachSeries from "async/eachSeries";

import { HUE_USERNAME } from "../config/private";
import { inherits } from "util";

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

const getLightIndexesByNamees = async (names: string[]): Promise<number[]> => {
  const hue = await getHue();
  const lights = await hue.getLamps();
  console.log(lights);

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

  return indexes;
};

const start = async () => {
  const hue = await getHue();

  const targetIndexes = await getLightIndexesByNamees(TARGET_LIGHTS);
  console.log("targetIndex", targetIndexes);
  // await hue.turnOff(targetIndex);
  // console.log("offed");

  await eachSeries(targetIndexes, async index => {
    await hue.flash(index);
    console.log("Flashed #gzcUwE", index);
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
