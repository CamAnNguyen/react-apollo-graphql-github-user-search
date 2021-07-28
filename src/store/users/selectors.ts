import { createSelector } from "reselect";

import { State } from "../state";
import { UsersState } from "./reducer";

export function getUser(state: State) {
  return state.users;
}

export const getUsers = createSelector(
  getUser,
  (users: UsersState) => users
);
