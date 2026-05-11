import BlurBackground from "../components/BlurBackground";
import LoaderAnimation from "../components/LoaderAnimation";
import MovieCard from "../components/MovieCard";
import { useMovies } from "../hooks/useMovie";

const Movies = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies();
  //flatten pages
  const movies = data?.pages.flatMap((page) => page.movies) || [];
  return (
    <div className="min-h-screen pt-25 pb-10 px-6 md:px-12 lg:px-24 xl:px-36">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-8 font-mono">
          <span className="bg-linear-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Movies now showing
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 mt-8 pb-12">
        <BlurBackground top="100px" right="100px" />
        {isLoading && (
          <div className="col-span-full flex items-center justify-center min-h-[400px]">
            <LoaderAnimation />
          </div>
        )}
        {isError && (
          <div className="col-span-full flex items-center justify-center min-h-[400px]">
            <p className="text-red-500">Error fetching movies</p>
          </div>
        )}

        {movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        <BlurBackground bottom="-100px" left="100px" />
      </div>

      <div className="flex flex-col items-center justify-center gap-6 mt-8">
        {isFetchingNextPage ? (
          <LoaderAnimation />
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="px-10 py-4 rounded-full bg-primary hover:bg-primary-dull text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30 cursor-pointer"
          >
            Load More Movies
          </button>
        ) : (
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">
            — End of Collection —
          </p>
        )}
      </div>
    </div>
  );
};

export default Movies;
