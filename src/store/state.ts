import { uiInitialState } from "./ui/reducer";

export const initialState = {
  ui: uiInitialState,
};

export type State = typeof initialState;
