import { combineReducers } from "redux";
import { State } from "./state";
import { uiReducer } from "./ui/reducer";

export const rootReducers = combineReducers<State>({
  ui: uiReducer
});
