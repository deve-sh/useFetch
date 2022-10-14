import { useContext } from "react";
import { FetchProviderContext } from "./index";

const useFetchContext = () => useContext(FetchProviderContext);

export default useFetchContext;
