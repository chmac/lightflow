import { Hue, HueUPNPResponse, Lamp, XYPoint, RGB } from "hue-hacking-node";
import { eachSeries, timesSeries } from "async";

import { HUE_USERNAME } from "../config/private";

const DEBUG = true;

const TARGET_LIGHTS = [
  "Right Light",
  "Left Light",
  "White Stand Light",
  "Black Stand Light"
];
const TARGET_COLOUR = new RGB(255, 0, 0);
const TARGET_TIME = 30 * 1e3; // 30s
const STEP_INTERVAL = 2 * 1e3; // 2s
const TOTAL_STEPS = TARGET_TIME / STEP_INTERVAL;

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

const nextStepBetweenColours = ({
  currentColour,
  targetColour,
  remainingSteps
}: {
  currentColour: RGB;
  targetColour: RGB;
  remainingSteps: number;
}) => {
  const newRGB = ["r", "g", "b"].map((colour): number => {
    const start = currentColour[colour];
    const end = targetColour[colour];
    const difference = end - start;
    const add = difference / remainingSteps;
    const newColour = Math.round(start + add);
    return newColour;
  });
  return new RGB(newRGB[0], newRGB[1], newRGB[2]);
};

const nextStep = async (targetIndexes: number[], remainingSteps: number) => {
  await eachSeries(targetIndexes, async index => {
    // await hue.flash(index);
    const currentColour = await getLampColour(index);
    const newColour = nextStepBetweenColours({
      currentColour,
      targetColour: TARGET_COLOUR,
      remainingSteps
    });

    if (DEBUG)
      console.log(
        "Colour transitions #oTYDwI",
        index,
        currentColour,
        newColour,
        remainingSteps
      );

    await hue.setColor(index, newColour.toCssString());
  });

  remainingSteps--;
  console.log(`Step completed #Hm1wK0, remaining steps: ${remainingSteps}`);
};

const start = async () => {
  const hue = await getHue();

  const targetIndexes = await getLightIndexesByNamees(TARGET_LIGHTS);
  if (DEBUG) console.log("targetIndex", targetIndexes);

  timesSeries(
    TOTAL_STEPS,
    async step => {
      const remainingSteps = TOTAL_STEPS - step;
      await nextStep(targetIndexes, remainingSteps);
      return new Promise(resolve => {
        setTimeout(resolve, STEP_INTERVAL);
      });
    },
    error => {
      if (error) {
        throw error;
      } else {
        console.log("timesSeries complete #7CtSVA");
      }
    }
  );
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
