import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../../store";
import { requestGraphql } from "../../requestGraphql";

const FETCH = "app/Lights/FETCH";
const FETCH_SUCCESS = "app/Lights/FETCH_SUCCESS";

export interface FetchAction extends Action<typeof FETCH> {
  payload: {};
}
export interface FetchSuccessAction extends Action<typeof FETCH_SUCCESS> {
  payload: {
    data: {
      lights: Light[];
    };
  };
}

const SET_SHOW_SAVE_MESSAGE = "cryptparty/ManageEvent/SET_SHOW_SAVE_MESSAGE";
export interface SetShowSaveMessageAction
  extends Action<typeof SET_SHOW_SAVE_MESSAGE> {
  payload: {
    showSaveMessage: boolean;
  };
}
export const setShowSaveMessage = (
  showSaveMessage: boolean
): SetShowSaveMessageAction => ({
  type: SET_SHOW_SAVE_MESSAGE,
  payload: {
    showSaveMessage
  }
});

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

export type Actions = FetchAction | FetchSuccessAction;

export type Light = {
  hueIndex: number;
  name: string;
  state: {
    on: boolean;
    colormode: string;
  };
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
      return { ...state, lights: action.payload.data.lights };
    }
  }

  return state;
};
