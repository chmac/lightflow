const DEBUG = true;

type LogMessage = {
  message: string;
  params: string;
  time: number;
};

const history: LogMessage[] = [];

export const log = (message: string, ...args) => {
  history.push({
    message,
    params: JSON.stringify(args),
    time: Math.round(Date.now() / 1e3),
  });

  if (DEBUG) {
    console.log(message);
  }
};

export const getLog = () => {
  return history;
};
