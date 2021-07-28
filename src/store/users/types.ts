export enum UserActions {
  FETCH_USERS = "user/FETCH_USERS",
  FETCH_USERS_SUCCESS = "user/FETCH_USERS_SUCCESS",
  FETCH_USERS_ERROR = "user/FETCH_USERS_ERROR",
  SET_PAGE = "user/SET_PAGE"
}

export interface User {
  id: number;
  login: string;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
}

export interface UserSearchResult {
  incomplete_results: boolean;
  items: Array<User>;
  total_count: number;
  fetchId: number;
  query: string;
  page: number;
  pageSize: number;
}

export interface UserSearch {
  query: string;
  page: number;
  pageSize: number;
}