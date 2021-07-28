import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { State } from "./state";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  Action<string>
>;

export enum ResourceState {
  LOADING = "loading",
  NOT_FOUND = "not found",
  FOUND = "found",
}
