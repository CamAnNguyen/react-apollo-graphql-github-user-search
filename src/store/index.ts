import {
  createStore,
  applyMiddleware,
  compose,
  CombinedState,
  AnyAction,
} from "redux";

import thunk from "redux-thunk";

import { StoreActionTypes } from "./actions";
import { rootReducers } from "./reducers";
import { initialState, State } from "./state";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

const enhancedRootReducers = (
  state: CombinedState<State> | undefined,
  action: AnyAction
) => {
  if (action.type === StoreActionTypes.RESET_STORE) {
    return rootReducers(undefined, action);
  }

  return rootReducers(state, action);
};

export const store = createStore(
  enhancedRootReducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);
