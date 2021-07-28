import { UserActionTypes } from "./actions";
import { User, UserActions } from "./types";

export const usersInitialState = {
  query: "",
  data: [] as Array<User>,
  totalCount: 0,
  currentPage: 0,
  pageSize: 10,
  incompleteResults: false,
};

export interface UsersState {
  query: string;
  data: Array<User>,
  totalCount: number,
  currentPage: number,
  pageSize: number,
  incompleteResults: boolean
}

export function usersReducer(
  state: UsersState = usersInitialState,
  action: UserActionTypes
): UsersState {
  if (!action.payload) return state;

  switch (action.type) {
    case UserActions.FETCH_USERS_SUCCESS:
      const {
        items,
        total_count,
        incomplete_results,
        query,
        page
      } = action.payload;

      return {
        ...state,
        query,
        totalCount: total_count,
        incompleteResults: incomplete_results,
        data: query === state.query ? state.data.concat(items) : items,
        currentPage: page
      };
    case UserActions.FETCH_USERS_ERROR:
      return usersInitialState;
    case UserActions.SET_PAGE:
      return {
        ...state,
        currentPage: action.payload.page
      }
    default:
      return state;
  }
}
