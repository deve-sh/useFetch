import { useContext } from "react";
import { FetchProviderContext } from "./index";

export const useFetchContext = () => useContext(FetchProviderContext);
