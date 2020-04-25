import { getHue } from "./utils";
import { startServer } from "./graphqlSchema";

const start = async () => {
  const hue = await getHue();

  await startServer({ hue });

  // tick()
  // hue.setColor(6, "00ff00");
};

start();
