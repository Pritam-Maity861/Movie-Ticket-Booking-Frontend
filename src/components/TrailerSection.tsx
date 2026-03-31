import { useState } from "react";
import BlurBackground from "./BlurBackground";
import ReactPlayer from "react-player";
import { CirclePlay } from "lucide-react";
import { useMovies } from "../hooks/useMovie";

const TrailerSection = () => {
  const { data: moviesData, isLoading } = useMovies();
  const allmovies = moviesData?.pages.flatMap((page) => page.movies) || [];
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);

  const currentMovie =
    allmovies.find((m) => m.id === activeMovieId) || allmovies[0];

  if (allmovies.length === 0) {
    if (isLoading) {
      return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[240px] mx-auto text-center md:text-left">
        Trailers
      </p>
      <div className="relative mt-6">
        <BlurBackground top="-100px" right="-100px" />
        <div className="aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/5 object-cover object-top">
          <ReactPlayer
            src={currentMovie?.trailerUrl}
            controls={true}
            width="100%"
            height="100%"
            light={currentMovie?.posterUrl}
            playIcon={
              <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl">
                <CirclePlay size={45} className="text-white fill-white ml-1" />
              </div>
            }
          />
        </div>
      </div>
      <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mt-12 max-w-5xl mx-auto">
        {allmovies.slice(0, 5).map((movie) => (
          <div
            key={movie.id}
            className={`relative group-hover:not-hover:opacity-50 hover:opacity-100! hover:-translate-y-2 duration-500 transition cursor-pointer rounded-2xl overflow-hidden border-2 ${
              activeMovieId === movie.id ||
              (!activeMovieId && movie === allmovies[0])
                ? "border-primary scale-105 shadow-lg shadow-primary/20 opacity-100"
                : "border-transparent opacity-60"
            }`}
            onClick={() => setActiveMovieId(movie.id)}
          >
            <div className="aspect-2/3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <CirclePlay
                strokeWidth={1.5}
                className={`absolute top-1/2 left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 text-white transition-opacity duration-300 ${
                  activeMovieId === movie.id ||
                  (!activeMovieId && movie === allmovies[0])
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
