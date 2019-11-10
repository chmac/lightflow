import { eachSeries, timesSeries } from "async";
import { Hue, HueColors } from "hue-hacking-node";

import { STEP_INTERVAL } from "../constants";
import { getLights, findLightByHueIndex } from "../utils";
import { STEP_INTERVAL_MS } from "../config/private";

const DEBUG = true;

const calculateNextBrightness = ({
  currentBrightness,
  targetBrightness,
  remainingSteps,
  totalSteps
}: {
  currentBrightness: number;
  targetBrightness: number;
  remainingSteps: number;
  totalSteps: number;
}) => {
  const difference = targetBrightness - currentBrightness;
  const nextStep = difference / remainingSteps;
  return Math.round(currentBrightness + nextStep);
};

const startRunToBrightness = async ({
  hue,
  hueIndexes,
  targetBrightness,
  timeMs
}: {
  hue: Hue;
  hueIndexes: number[];
  targetBrightness: number;
  timeMs: number;
}) => {
  const totalSteps = Math.ceil(timeMs / STEP_INTERVAL);

  timesSeries(
    totalSteps,
    async step => {
      const remainingSteps = totalSteps - step;

      const lights = await hue.getLamps();

      eachSeries(hueIndexes, async hueIndex => {
        const light = findLightByHueIndex(lights, hueIndex);
        const currentBrightness = light.state.bri;

        const nextBrightness = calculateNextBrightness({
          currentBrightness,
          targetBrightness,
          remainingSteps,
          totalSteps
        });

        await hue.setBrightness(hueIndex, nextBrightness);

        if (DEBUG)
          console.log(
            "Brightness #l7TYIY",
            hueIndex,
            currentBrightness,
            nextBrightness,
            step,
            remainingSteps,
            totalSteps
          );
      });

      return new Promise(resolve => {
        setTimeout(resolve, STEP_INTERVAL_MS);
      });
    },
    (err, result) => {
      console.log("Finished run to brightness #LxS2wT");
    }
  );
};

export const goToBrightness = async ({
  hue,
  hueIndexes,
  brightness,
  timeMinutes
}: {
  hue: Hue;
  hueIndexes: number[];
  brightness: number;
  timeMinutes: number;
}) => {
  startRunToBrightness({
    hue,
    hueIndexes,
    targetBrightness: brightness,
    timeMs: timeMinutes * 60 * 1e3
  });
  return true;
};
