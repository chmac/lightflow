import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../../store";
import { requestGraphql } from "../../requestGraphql";
import { statement } from "@babel/template";
import { GetLights } from "./Lights.queries";
import { GoToBrightness } from "./Lights.mutations";

const FETCH = "app/Lights/FETCH";
const FETCH_SUCCESS = "app/Lights/FETCH_SUCCESS";

export interface FetchAction extends Action<typeof FETCH> {
  payload: {};
}
export interface FetchSuccessAction extends Action<typeof FETCH_SUCCESS> {
  payload: {
    data: {
      lights: LightData[];
    };
  };
}

export const fetchLights = (): ThunkAction<
  void,
  AppState,
  {},
  AnyAction
> => async dispatch => {
  dispatch({
    type: FETCH
  });

  const data = await requestGraphql(GetLights);

  dispatch({
    type: FETCH_SUCCESS,
    payload: {
      data
    }
  });
};

const CHECK = "app/Lights/CHECK";
export interface CheckAction extends Action<typeof CHECK> {
  payload: {
    hueIndex: number;
  };
}

export const check = (hueIndex: number): CheckAction => {
  return {
    type: CHECK,
    payload: {
      hueIndex
    }
  };
};

const TO_BRIGHTNESS = "app/Lights/TO_BRIGHTNESS";
export interface ToBrightnessAction extends Action<typeof TO_BRIGHTNESS> {
  payload: {};
}

export const toBrightness = (): ThunkAction<
  void,
  AppState,
  {},
  AnyAction
> => async (dispatch, getState) => {
  const state = getState();
  const { brightness, timeMinutes } = state.Lights;

  const hueIndexes = getHueIndexes(state);

  await requestGraphql(GoToBrightness, {
    input: {
      hueIndexes,
      brightness,
      timeMinutes
    }
  });
  dispatch({
    type: TO_BRIGHTNESS,
    payload: {}
  });
};

export type Actions = FetchAction | FetchSuccessAction | CheckAction;

export const getHueIndexes = (state: AppState) => {
  return state.Lights.lights.reduce<number[]>((hueIndexes, light) => {
    if (light.checked) {
      return hueIndexes.concat(light.data.hueIndex);
    }
    return hueIndexes;
  }, []);
};

type LightData = {
  hueIndex: number;
  name: string;
  state: {
    on: boolean;
    colormode: string;
  };
};

export type Light = {
  data: LightData;
  checked: boolean;
};

type LightsState = {
  lights: Light[];
  brightness: number;
  colour: string;
  timeMinutes: number;
};

const empty: LightsState = {
  lights: [],
  brightness: 254,
  colour: "red",
  timeMinutes: 30
};

export const reducer = (
  state: LightsState = empty,
  action: Actions
): LightsState => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      return {
        ...state,
        lights: action.payload.data.lights.map(light => ({
          data: light,
          checked: false
        }))
      };
    }
    case CHECK: {
      return {
        ...state,
        lights: state.lights.map(light => {
          if (light.data.hueIndex === action.payload.hueIndex) {
            return { ...light, checked: !light.checked };
          }
          return light;
        })
      };
    }
  }

  return state;
};
