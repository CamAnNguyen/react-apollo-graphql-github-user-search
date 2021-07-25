export enum StoreActionTypes {
  RESET_STORE = "RESET_STORE",
}

export function resetStore() {
  return { type: StoreActionTypes.RESET_STORE };
}
