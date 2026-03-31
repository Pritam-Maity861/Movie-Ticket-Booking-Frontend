import BlurBackground from "../components/BlurBackground";
import LoaderAnimation from "../components/LoaderAnimation";
import MovieCard from "../components/MovieCard";
import { useMovies } from "../hooks/useMovie";

const Movies = () => {
  const {data,isLoading,isError,fetchNextPage,hasNextPage,isFetchingNextPage}=useMovies();
  //flatten pages
  const movies = data?.pages.flatMap((page) => page.movies) || [];
  return (
    <div className="min-h-screen pt-25 pb-10">
      <h1 className="text-gray-300 text-lg font-medium flex justify-center">
        Movies now showing
      </h1>
      <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-8 mt-8 px-6 md:px-16 lg:px-24 xl:px-44">
        <BlurBackground top="100px" right="100px" />
        {isLoading && <div className="flex items-center justify-center min-h-[500px]"><LoaderAnimation /></div>}
        {isError && <div className="flex items-center justify-center min-h-[500px]"><p className="text-red-500">Error fetching movies</p></div>}

        {movies.map((movie:any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        <BlurBackground bottom="-100px" left="100px" />
      </div>
      {isFetchingNextPage ? <LoaderAnimation />:<p className="text-center text-gray-400 mt-6">No more movies</p>}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Movies;
