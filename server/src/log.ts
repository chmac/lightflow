const DEBUG = true;

type LogMessage = {
  message: string;
  params: string;
  time: number;
};

const history: LogMessage[] = [];

export const log = (message: string, ...args) => {
  history.splice(0, 0, {
    message,
    params: JSON.stringify(args, null, 2),
    time: Math.round(Date.now() / 1e3),
  });
  // Ensure the history is only ever max 200 items
  history.splice(200);

  if (DEBUG) {
    console.log(message, ...args);
  }
};

export const getLog = () => {
  return history;
};
