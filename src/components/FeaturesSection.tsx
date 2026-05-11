import { useNavigate } from "react-router-dom";
import BlurBackground from "./BlurBackground";
import MovieCard from "./MovieCard";
import { useMovies } from "../hooks/useMovie";

const FeaturesSection = () => {
  const navigate = useNavigate();
  const { data: movieData } = useMovies();
  const movies = movieData?.pages.flatMap((page) => page.movies) || [];

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between  pt-20 pb-10 ">
        <BlurBackground top="0" right="-80px" />
        <p className="text-gray-300 text-lg font-medium ">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="flex items-center text-gray-300 cursor-pointer"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
        {movies.slice(0, 8).map((show) => (
          <MovieCard key={show.id} movie={show} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-4 py-2 sm:px-7 sm:py-3 bg-primary hover:bg-primary-dull cursor-pointer transition rounded-2xl font-medium"
        >
          Show more →
        </button>
      </div>
    </div>
  );
};

export default FeaturesSection;
