import { useContext } from "react";
import GlobalDataContext from "../context/GlobalDataProvider";

const useGlobalData = () => {
  const { globalData, setGlobalData } = useContext(GlobalDataContext);
  return { globalData, setGlobalData };
};

export default useGlobalData;
