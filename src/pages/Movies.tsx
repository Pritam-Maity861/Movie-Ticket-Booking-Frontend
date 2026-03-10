import { dummyShowsData } from "../assets/assets";
import BlurBackground from "../components/BlurBackground";
import MovieCard from "../components/MovieCard";

const Movies = () => {
  return (
    <div className="min-h-screen pt-25 pb-10">
      <h1 className="text-gray-300 text-lg font-medium flex justify-center">
        Movies now showing
      </h1>
      <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-8 mt-8 px-6 md:px-16 lg:px-24 xl:px-44">
        <BlurBackground top="100px" right="100px" />
        {dummyShowsData.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
        <BlurBackground bottom="-100px" left="100px" />
      </div>
    </div>
  );
};

export default Movies;
