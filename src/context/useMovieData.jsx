import { useContext } from "react";
import { MovieDataContext } from "./MovieDataContext";

const useMovieData = () => {
  const context = useContext(MovieDataContext);
  if (!context) {
    throw new Error("useMovieData must be used within a MovieDataProvider");
  }
  return context;
};

export default useMovieData;
