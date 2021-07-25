import { Action } from "redux";

import { Language } from "i18n";

import { UIActions } from "./types";

export interface SetLoading extends Action {
  type: UIActions.SET_LOADING;
  payload: boolean;
}

export interface SetLanguage extends Action {
  type: UIActions.SET_LANGUAGE;
  payload: Language;
}

export type AppActionTypes = SetLoading | SetLanguage;

export function setLoading(payload: boolean): SetLoading {
  return { type: UIActions.SET_LOADING, payload };
}

export function setLanguage(payload: Language): SetLanguage {
  return { type: UIActions.SET_LANGUAGE, payload };
}
