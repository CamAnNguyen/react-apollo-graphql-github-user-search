import React from "react";
import { useSelector } from "react-redux";

import { isLoading } from "store/ui/selectors";
import { Loader } from "components/Loader";

export function AppLoader() {
  const loading = useSelector(isLoading);

  return <React.Fragment>{loading ? <Loader /> : null}</React.Fragment>;
}
