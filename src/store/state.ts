import { uiInitialState } from "./ui/reducer";
import { usersInitialState } from "./users/reducer";

export const initialState = {
  ui: uiInitialState,
  users: usersInitialState,
};

export type State = typeof initialState;
