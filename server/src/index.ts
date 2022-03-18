import { startServer } from "./graphqlSchema";

const start = async () => {
  try {
    await startServer();
  } catch (err) {
    console.error("Startup error #XQN67n");
    console.error(err);
    process.exit();
  }

  // tick()
  // hue.setColor(6, "00ff00");
};

start();
