import { eachSeries, timesSeries } from "async";
import { Hue } from "hue-hacking-node";

import { findLightByHueIndex, getStepInterval } from "../utils";
import { log } from "../log";

const calculateNextBrightness = ({
  currentBrightness,
  targetBrightness,
  remainingSteps,
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
  timeMs,
}: {
  hue: Hue;
  hueIndexes: number[];
  targetBrightness: number;
  timeMs: number;
}) => {
  const stepInterval = getStepInterval(timeMs);
  const totalSteps = Math.ceil(timeMs / stepInterval);

  timesSeries(
    totalSteps,
    async (step) => {
      const remainingSteps = totalSteps - step;

      const lights = await hue.getLamps();

      eachSeries(hueIndexes, async (hueIndex) => {
        const light = findLightByHueIndex(lights, hueIndex);
        const currentBrightness = light.state.bri;

        const nextBrightness = calculateNextBrightness({
          currentBrightness,
          targetBrightness,
          remainingSteps,
          totalSteps,
        });

        await hue.setBrightness(hueIndex, nextBrightness);

        log("Brightness #l7TYIY", {
          hueIndex,
          currentBrightness,
          nextBrightness,
          step,
          remainingSteps,
          totalSteps,
        });
      });

      return new Promise((resolve) => {
        setTimeout(resolve, stepInterval);
      });
    },
    (err, result) => {
      log("Finished run to brightness #LxS2wT");
    }
  );
};

export const goToBrightness = async ({
  hue,
  hueIndexes,
  brightness,
  timeMinutes,
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
    timeMs: timeMinutes * 60 * 1e3,
  });
  return true;
};
