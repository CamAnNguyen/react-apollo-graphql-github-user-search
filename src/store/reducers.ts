import { combineReducers } from "redux";
import { State } from "./state";
import { uiReducer } from "./ui/reducer";
import { usersReducer } from "./users/reducer";

export const rootReducers = combineReducers<State>({
  ui: uiReducer,
  users: usersReducer,
});
