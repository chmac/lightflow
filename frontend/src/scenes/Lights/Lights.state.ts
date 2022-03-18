import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../../store";
import { requestGraphql } from "../../requestGraphql";
import { GetLights } from "./Lights.queries";
import { GoToBrightness, GoToColour } from "./Lights.mutations";
import { BRIGHTNESS_UI_LEVELS } from "./Lights.scene";

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

export const fetchLights =
  (): ThunkAction<void, AppState, {}, AnyAction> => async (dispatch) => {
    dispatch({
      type: FETCH,
    });

    try {
      const data = await requestGraphql(GetLights);

      dispatch({
        type: FETCH_SUCCESS,
        payload: {
          data,
        },
      });
    } catch (e) {
      alert(
        `#12X9Mx Fetch failed with error. ${
          e instanceof Error ? e.message : JSON.stringify(e)
        }`
      );
    }
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
      hueIndex,
    },
  };
};

const GO_TO_BRIGHTNESS = "app/Lights/GO_TO_BRIGHTNESS";
export const goToBrightness =
  (): ThunkAction<void, AppState, {}, AnyAction> =>
  async (dispatch, getState) => {
    const state = getState();
    const { brightness: brightnessTwenty, timeMinutes } = state.Lights;

    // Convert the brightness figure on a scale of 0-20 to 0-255
    const brightness = Math.round(
      (brightnessTwenty * 255) / BRIGHTNESS_UI_LEVELS
    );

    const hueIndexes = getHueIndexes(state);
    const selectedLights = getSelectedLights(state);

    if (hueIndexes.length === 0) {
      alert("No lights selected. #GVuJTE");
      return;
    }

    const message = `Set:
- ${selectedLights.map((light) => light.name).join("\n- ")}
to ${Math.round((brightnessTwenty / BRIGHTNESS_UI_LEVELS) * 100)}%
over ${timeMinutes} minutes`;
    if (!window.confirm(message)) {
      return;
    }

    try {
      await requestGraphql(GoToBrightness, {
        input: {
          hueIndexes,
          brightness,
          timeMinutes,
        },
      });

      dispatch({
        type: GO_TO_BRIGHTNESS,
        payload: {},
      });
    } catch (e) {
      debugger;
      alert(
        `#oek0su GoToBrigthness failed with error: ${
          e instanceof Error ? e.message : JSON.stringify(e)
        }`
      );
    }
  };

const GO_TO_COLOUR = "app/Lights/GO_TO_COLOUR";
export interface ToBrightnessAction extends Action<typeof GO_TO_COLOUR> {
  payload: {};
}

export const goToColour =
  (): ThunkAction<void, AppState, {}, AnyAction> =>
  async (dispatch, getState) => {
    const state = getState();
    const { colour, timeMinutes } = state.Lights;

    const hueIndexes = getHueIndexes(state);
    const selectedLights = getSelectedLights(state);

    const message = `Set:
- ${selectedLights.map((light) => light.name).join("\n- ")}
to ${colour}
over ${timeMinutes} minutes`;
    if (!window.confirm(message)) {
      return;
    }

    try {
      await requestGraphql(GoToColour, {
        input: {
          hueIndexes,
          colour,
          timeMinutes,
        },
      });

      dispatch({
        type: GO_TO_COLOUR,
        payload: {},
      });
    } catch (e) {
      alert(
        `#bG4twO GoToColour failed with error: ${
          e instanceof Error ? e.message : JSON.stringify(e)
        }`
      );
    }
  };

const SET_TIME_MINUTES = "app/Lights/SET_TIME_MINUTES";
export interface SetTimeMinutesAction extends Action<typeof SET_TIME_MINUTES> {
  payload: {
    timeMinutes: number;
  };
}
export const setTimeMinutes = (timeMinutes: number): SetTimeMinutesAction => ({
  type: SET_TIME_MINUTES,
  payload: {
    timeMinutes,
  },
});

const SET_BRIGHTNESS = "app/Lights/SET_BRIGHTNESS";
export interface SetBrightnessAction extends Action<typeof SET_BRIGHTNESS> {
  payload: {
    brightness: number;
  };
}
export const setBrightness = (brightness: number): SetBrightnessAction => ({
  type: SET_BRIGHTNESS,
  payload: {
    brightness,
  },
});

const SET_COLOUR = "app/Lights/SET_COLOUR";
export interface SetColourAction extends Action<typeof SET_COLOUR> {
  payload: {
    colour: string;
  };
}
export const setColour = (colour: string): SetColourAction => ({
  type: SET_COLOUR,
  payload: {
    colour,
  },
});

export type Actions =
  | FetchAction
  | FetchSuccessAction
  | CheckAction
  | SetTimeMinutesAction
  | SetBrightnessAction
  | SetColourAction;

export const getSelectedLights = (state: AppState) => {
  return state.Lights.lights.reduce<LightData[]>((accumulator, light) => {
    if (light.checked) {
      return accumulator.concat(light.data);
    }
    return accumulator;
  }, []);
};

export const getHueIndexes = (state: AppState) => {
  return getSelectedLights(state).map(({ hueIndex }) => hueIndex);
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
  brightness: 20,
  colour: "orangered",
  timeMinutes: 30,
};

export const reducer = (
  state: LightsState = empty,
  action: Actions
): LightsState => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      return {
        ...state,
        lights: action.payload.data.lights.map((light) => ({
          data: light,
          checked: false,
        })),
      };
    }
    case CHECK: {
      return {
        ...state,
        lights: state.lights.map((light) => {
          if (light.data.hueIndex === action.payload.hueIndex) {
            return { ...light, checked: !light.checked };
          }
          return light;
        }),
      };
    }
    case SET_TIME_MINUTES: {
      return {
        ...state,
        timeMinutes: action.payload.timeMinutes,
      };
    }
    case SET_BRIGHTNESS: {
      return {
        ...state,
        brightness: action.payload.brightness,
      };
    }
    case SET_COLOUR: {
      return {
        ...state,
        colour: action.payload.colour,
      };
    }
  }

  return state;
};
