import { getHue } from "./utils";
import { startServer } from "./graphqlSchema";

const start = async () => {
  try {
    const hue = await getHue();

    await startServer({ hue });
  } catch (err) {
    console.error("Startup error #XQN67n");
    console.error(err);
    process.exit();
  }

  // tick()
  // hue.setColor(6, "00ff00");
};

start();
