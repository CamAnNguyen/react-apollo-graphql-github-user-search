import { Action } from "redux";

import { AppThunk } from "store/types";
import { createRequest } from "utils/network";
import { GITHUB_USER_SEARCH_API } from "routes/constants";

import { UserActions, UserSearch, UserSearchResult } from "./types";
import { setLoading } from "store/ui/actions";

export interface FetchUsers extends Action {
  type: UserActions.FETCH_USERS;
  payload: UserSearch;
}

export interface FetchUsersResult extends Action {
  type: UserActions.FETCH_USERS_SUCCESS |
        UserActions.FETCH_USERS_ERROR;
  payload: UserSearchResult;
}

export interface SetPage extends Action {
  type: UserActions.SET_PAGE;
  payload: { page: number };
}

export type UserActionTypes = FetchUsers | FetchUsersResult | SetPage;

export function fetchUsers(
  query: string,
  page: number = 0,
  pageSize: number = 10
): AppThunk {
  return async (dispatch: Function) => {
    dispatch(setLoading(true));

    const { response, error } = await createRequest(
      `${GITHUB_USER_SEARCH_API}?q=${query}&page=${page + 1}&per_page=${pageSize}`,
      {
        method: "GET",
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      }
    );

    dispatch(setLoading(false));

    const errMess = error ? error.message : response.message;
    if (errMess) {
      return dispatch({
        type: UserActions.FETCH_USERS_ERROR,
        payload: errMess,
      });
    } 

    return dispatch({
      type: UserActions.FETCH_USERS_SUCCESS,
      payload: { ...response, query, page, pageSize },
    });
  };
}

export const setPage = (page: number = 1) => ({
  type: UserActions.SET_PAGE,
  payload: { page }
});
