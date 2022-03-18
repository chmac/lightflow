import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../../store";
import { requestGraphql } from "../../requestGraphql";
import { GetLog } from "./Log.queries";

const FETCH = "app/Log/FETCH";
const FETCH_SUCCESS = "app/Log/FETCH_SUCCESS";

export interface FetchAction extends Action<typeof FETCH> {
  payload: {};
}
export interface FetchSuccessAction extends Action<typeof FETCH_SUCCESS> {
  payload: {
    data: {
      log: LogMessage[];
    };
  };
}

export const fetchLog =
  (): ThunkAction<void, AppState, {}, AnyAction> => async (dispatch) => {
    dispatch({
      type: FETCH,
    });

    try {
      const data = await requestGraphql(GetLog);

      dispatch({
        type: FETCH_SUCCESS,
        payload: {
          data,
        },
      });
    } catch (e) {
      alert(`#oHDmxE Fetch failed with error. ${e.message}`);
    }
  };

export type Actions = FetchAction | FetchSuccessAction;

type LogMessage = {
  time: number;
  message: string;
  params: string;
};

type LogState = {
  log: LogMessage[];
};

const empty: LogState = {
  log: [],
};

export const reducer = (state: LogState = empty, action: Actions): LogState => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      return {
        log: action.payload.data.log,
      };
    }
  }

  return state;
};
