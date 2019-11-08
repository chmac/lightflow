import { Action } from "redux";

type Light = {
  hueIndex: number;
};

type LightsState = {
  lights: Light[];
};

const empty: LightsState = {
  lights: []
};

export const reducer = (state: LightsState = empty, action: Action) => {
  return state;
};
