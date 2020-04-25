import { Hue, Lamp, XYPoint } from "hue-hacking-node";
import { eachSeries, timesSeries } from "async";

import { getLights, findLightByHueIndex, getStepInterval } from "./utils";
import { log } from "./log";

const nextStepBetweenColours = ({
  currentColour,
  targetColour,
  remainingSteps,
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

export const toColour = async ({
  hue,
  hueIndexes: targetIndexes,
  targetColour,
  timeMs,
}: {
  hue: Hue;
  hueIndexes: number[];
  targetColour: XYPoint;
  timeMs: number;
}) => {
  log("toColour #TUAzvL", { targetIndexes, targetColour, timeMs });

  // For very short durations (<60s) we choose a shorter (2s) interval
  const stepInterval = getStepInterval(timeMs);

  const totalSteps = Math.ceil(timeMs / stepInterval);

  timesSeries(
    totalSteps,
    async (step) => {
      const remainingSteps = totalSteps - step;
      const lights = await getLights();

      await eachSeries(targetIndexes, async (hueIndex) => {
        const light = findLightByHueIndex(lights, hueIndex);

        const currentColour = new XYPoint(...light.state.xy);
        const newColour = nextStepBetweenColours({
          currentColour,
          targetColour,
          remainingSteps,
        });

        await hue.setColor(hueIndex, newColour);
        log(
          `Just set colour #fMeD0L. Light hue index ${hueIndex}. Step ${step} / ${totalSteps}. Current; Next`,
          { currentColour, newColour }
        );
      });

      return new Promise((resolve) => {
        setTimeout(resolve, stepInterval);
      });
    },
    (error) => {
      if (error) {
        throw error;
      } else {
        log("Go to colour complete #7CtSVA");
      }
    }
  );
};
