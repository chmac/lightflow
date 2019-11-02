import { Hue, HueUPNPResponse } from "hue-hacking-node";
import { HUE_USERNAME } from "../config/private";

const TARGET_LIGHT = "Right Light";

const getBridgeIp = async () => {
  const foundBridges: HueUPNPResponse[] = await Hue.search();

  if (foundBridges.length !== 1) {
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

const getLightIndexByName = async (name: string) => {
  const hue = await getHue();
  const lights = await hue.getLamps();
  console.log(lights);

  const index = lights.findIndex(light => {
    return light.name.indexOf(name) !== -1;
  });

  if (index === -1) {
    throw new Error("Failed to find light");
  }

  // The array is zero indexed but hue is 1 indexed, so add 1 here
  return index + 1;
};

const start = async () => {
  const hue = await getHue();

  const targetIndex = await getLightIndexByName(TARGET_LIGHT);
  console.log("targetIndex", targetIndex);
  // await hue.turnOff(targetIndex);
  // console.log("offed");
  await hue.flash(targetIndex);
  console.log("flashed");

  // hue.setColor(targetIndex, "red");
  // console.log("red");

  console.log("args", process.argv);
};

start();
