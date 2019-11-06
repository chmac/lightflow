import {
  Hue,
  HueUPNPResponse,
  Lamp,
  XYPoint,
  HueColors
} from "hue-hacking-node";
import { eachSeries, timesSeries } from "async";

import {
  HUE_USERNAME,
  TARGET_LIGHTS,
  TARGET_COLOUR,
  TARGET_TIME,
  STEP_INTERVAL
} from "./config/private";

import { getHue, getLights } from "./utils";

const colours = new HueColors();

const DEBUG = true;

const TOTAL_STEPS = TARGET_TIME / STEP_INTERVAL;

const getLightIndexesByNamees = async (names: string[]): Promise<number[]> => {
  const lights = await getLights();

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

  if (DEBUG) {
    console.log("Got light indexes #XljJyD");
    indexes.forEach(index => {
      console.log("Light state #qQ5v49", lights[index - 1].state);
    });
  }

  return indexes;
};

const getLampByHueIndex = async (hueIndex: number): Promise<Lamp> => {
  const lamps = await getLights();
  const lamp = lamps[hueIndex - 1];
  if (!lamp) {
    throw new Error(`Could not find lamp #akrrNk, hueIndex: ${hueIndex}`);
  }
  return lamp;
};

const getLampColour = async (hueIndex: number) => {
  const lamp = await getLampByHueIndex(hueIndex);

  if (DEBUG) console.log("Lamp colour #1cHx7a", lamp.state.xy, lamp.state.bri);

  if (!!lamp.state.xy && !!lamp.state.bri) {
    return new XYPoint(lamp.state.xy[0], lamp.state.xy[1]);
  }
  throw new Error("Lamp has no colour #FncbSE");
};

const nextStepBetweenColours = ({
  currentColour,
  targetColour,
  remainingSteps
}: {
  currentColour: XYPoint;
  targetColour: XYPoint;
  remainingSteps: number;
}) => {
  const xy = ["x", "y"].map((colour): number => {
    const start = currentColour[colour];
    const end = targetColour[colour];
    const difference = end - start;
    const add = difference / remainingSteps;
    const newColour = start + add;
    return newColour;
  });
  return new XYPoint(...xy);
};

let lastColour: XYPoint[] = [];

const nextStep = async ({
  targetIndexes,
  targetColour,
  remainingSteps,
  hue
}: {
  targetIndexes: number[];
  targetColour: XYPoint;
  remainingSteps: number;
  hue: Hue;
}) => {
  await eachSeries(targetIndexes, async index => {
    // await hue.flash(index);
    const currentColour = !!lastColour[index - 1]
      ? lastColour[index - 1]
      : await getLampColour(index);
    const newColour = nextStepBetweenColours({
      currentColour,
      targetColour,
      remainingSteps
    });
    lastColour[index - 1] = newColour;

    if (DEBUG)
      console.log(
        `Colour transitions #oTYDwI index: ${index}; remaining steps: ${remainingSteps}; current; next;`,
        currentColour,
        newColour
      );

    // await hue.setColor(index, hue.colors.CIE1931ToHex(newColour));
    await hue.setColor(index, newColour);
  });

  console.log(
    `Step completed #Hm1wK0, remaining steps: ${remainingSteps} / ${TOTAL_STEPS} (${(remainingSteps *
      STEP_INTERVAL) /
      1e3}s remaining)`
  );
};

export const toColour = async ({
  hue,
  hueIndexes: targetIndexes,
  targetColour
}: {
  hue: Hue;
  hueIndexes: number[];
  targetColour: XYPoint;
}) => {
  if (DEBUG) console.log("targetIndex #TUAzvL", targetIndexes);

  timesSeries(
    TOTAL_STEPS,
    async step => {
      const remainingSteps = TOTAL_STEPS - step;
      await nextStep({ targetIndexes, remainingSteps, hue, targetColour });
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
