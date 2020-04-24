import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import { reducer as Lights } from "./scenes/Lights/Lights.state";
import { reducer as Log } from "./scenes/Log/Log.state";

const reducer = combineReducers({ Lights, Log });

export type AppState = ReturnType<typeof reducer>;

const composeEnhancers =
  typeof window === "object" &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);
