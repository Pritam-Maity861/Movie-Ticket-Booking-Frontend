import { useMemo } from "react";
import { useMoviesWithoutPagination } from "../hooks/useMovie";
import MovieCard from "../components/MovieCard";
import LoaderAnimation from "../components/LoaderAnimation";
import BlurBackground from "../components/BlurBackground";

const Releases = () => {
  const { data: movies, isLoading, isError } = useMoviesWithoutPagination();

  const newReleases = useMemo(() => {
    if (!movies) return [];
    // Sort movies by createdAt descending
    const sorted = [...movies].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sorted.slice(0, 10);
  }, [movies]);

  if (isLoading) return <LoaderAnimation />;
  if (isError)
    return (
      <div className="text-center mt-32 text-red-500">
        Failed to load movies
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white pt-24 pb-12">
      <BlurBackground />
      <div className="px-6 md:px-16 lg:px-36 relative z-10">
        <h1 className="text-3xl font-bold mb-8 font-mono">
          <span className="bg-linear-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            New Releases
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {newReleases.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isNewRelease={true} />
          ))}
        </div>
        {newReleases.length === 0 && (
          <p className="text-gray-400 mt-10 text-center text-lg">
            No movies found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Releases;
