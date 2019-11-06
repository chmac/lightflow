import { Hue } from "hue-hacking-node";

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
  // Cancel any existing actions
  // Start a new action

  const results = await Promise.all(
    hueIndexes.map(index => {
      return startTransitionToColour({
        index,
        colour,
        timeMinutes,
        hue
      });
    })
  );
  return {
    // Only return `true` if all operations were successful
    success: results.find(result => !result) || true,
    results
  };
};
