import { Hue, HueColors } from "hue-hacking-node";
import { toColour } from "../toColour";

const startTransitionToColour = async (args: any) => {
  return true;
};

export const goToColour = async ({
  hue,
  hueIndexes,
  colour,
  timeMinutes
}: {
  hue: Hue;
  hueIndexes: number[];
  colour: string;
  timeMinutes: number;
}) => {
  toColour({ hue, hueIndexes, targetColour: hue.colors.hexToCIE1931(colour) });

  return {
    success: true
  };
};
