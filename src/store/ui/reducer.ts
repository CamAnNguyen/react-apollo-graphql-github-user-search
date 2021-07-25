import { AppActionTypes } from "./actions";
import { UIActions } from "./types";
import { Language } from "../../i18n";

export const uiInitialState = {
  language: (localStorage.getItem("language") || "en") as Language,
  loading: false as boolean,
};

export type UIState = typeof uiInitialState;

export function uiReducer(
  state: UIState = uiInitialState,
  action: AppActionTypes
): UIState {
  switch (action.type) {
    case UIActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case UIActions.SET_LANGUAGE:
      localStorage.setItem("language", action.payload);

      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
}
