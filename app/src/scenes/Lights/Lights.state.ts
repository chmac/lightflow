import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../../store";
import { requestGraphql } from "../../requestGraphql";
import { statement } from "@babel/template";

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

  const data = await requestGraphql(`
    query Lights {
      lights {
        hueIndex
        name
        state {
          on
          reachable
          colormode
          brightness
          hue
          saturation
          xy
          xyAsHex
          colourTemperature
        }
      }
    }
  `);

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

export type Actions = FetchAction | FetchSuccessAction | CheckAction;

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
};

const empty: LightsState = {
  lights: []
};

export const reducer = (state: LightsState = empty, action: Actions) => {
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
