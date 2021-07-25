import { createSelector } from "reselect";

import { State } from "../state";
import { UIState } from "./reducer";

export function getUI(state: State) {
  return state.ui;
}

export const getLanguage = createSelector(
  getUI,
  (ui: UIState) => ui.language
);

export const isLoading = createSelector(getUI, (ui: UIState) => ui.loading);
