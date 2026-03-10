import { useParams, useNavigate } from "react-router-dom";
import { dummyShowsData, dummyDateTimeData } from "../assets/assets";
import {
  StarIcon,
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  HeartIcon,
} from "lucide-react";
import timeFormat from "../lib/timeFormat";
import BlurBackground from "../components/BlurBackground";
import { useState } from "react";
import MovieCard from "../components/MovieCard";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = dummyShowsData.find(
    (show) => show._id === id || show.id.toString() === id,
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(
    Object.keys(dummyDateTimeData)[0],
  );
  const [isFavorite, setIsFavorite] = useState(false);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-semibold text-2xl">
        Movie not found
      </div>
    );
  }

  const otherMovies = dummyShowsData
    .filter((show) => show._id !== movie._id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-10 text-white relative">
      <BlurBackground top="0%" left="0%" />
      <BlurBackground bottom="0%" right="0%" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 z-10 relative">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start animate-fade-in-up">
          {/* Poster */}
          <div className="shrink-0 relative group">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-72 sm:w-80 lg:w-87.5 rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500 object-cover border border-white/10"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5 mt-4 lg:mt-8 flex-1">
            <p className="text-primary font-bold tracking-widest uppercase text-sm">
              {movie.original_language === "en"
                ? "ENGLISH"
                : movie.original_language}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
              {movie.title}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <StarIcon className="w-5 h-5 text-primary fill-primary" />
              <span className="font-semibold text-lg">
                {movie.vote_average.toFixed(1)}{" "}
                <span className="text-sm text-gray-400 font-normal">
                  ({(movie.vote_count / 1000).toFixed(1)}k Rating)
                </span>
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-2xl text-md md:text-lg">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base font-medium">
              <span className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" /> {timeFormat(movie.runtime)}
              </span>
              <span>•</span>
              <span>{movie.genres.map((g) => g.name).join(" | ")}</span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />{" "}
                {new Date(movie.release_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 transition rounded-full font-semibold border border-gray-600 shadow-lg hover:shadow-xl cursor-pointer">
                <PlayIcon className="w-4 h-4" /> Watch Trailer
              </button>
              <button
               
                className="px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full font-semibold shadow-lg shadow-primary/30 cursor-pointer"
              >
                Buy Tickets
              </button>
              <button
               
                className="p-3 bg-gray-800 hover:bg-gray-700 transition rounded-full border border-gray-600 shadow-lg group cursor-pointer"
              >
                <HeartIcon
                  className={`w-5 h-5 transition ${isFavorite ? "text-primary fill-primary" : "text-gray-300 group-hover:text-primary"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 relative inline-block">
            Your Favorite Cast
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide py-2">
            {movie.casts.map((cast, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 min-w-25 group cursor-pointer"
              >
                <img
                  src={cast.profile_path}
                  alt={cast.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition duration-300 group-hover:scale-110 shadow-lg bg-gray-800"
                />
                <div className="text-center">
                  <p className="font-semibold text-sm truncate w-24 text-gray-200">
                    {cast.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate w-24">
                    {cast.name.split(" ")[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show Date Section */}
        <div className="mt-16 sm:mt-24">
          <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden">
            {/* Background glow for the section */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex-1 w-full z-10">
              <h2 className="text-xl font-bold mb-6 text-gray-200">
                Choose Date
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {Object.keys(dummyDateTimeData).map((dateStr) => {
                  const dateObj = new Date(dateStr);
                  const day = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  const date = dateObj.toLocaleDateString("en-US", {
                    day: "numeric",
                  });

                  return (
                    <div
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex flex-col items-center justify-center min-w-17.5 h-21.25 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedDate === dateStr
                          ? "bg-primary text-white shadow-lg shadow-primary/40 transform scale-105"
                          : "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                      }`}
                    >
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {day}
                      </span>
                      <span className="text-2xl font-bold mt-1">{date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full md:w-auto flex justify-center md:justify-end z-10">
              <button
               
                className="w-full md:w-auto px-10 py-4 bg-primary hover:bg-primary-dull transition rounded-full font-bold shadow-xl shadow-primary/30 text-lg md:whitespace-nowrap cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Movies */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold relative inline-block">
              You May Also Like
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
            </h2>
            <button
              onClick={() => {
                navigate("/movies");
                scrollTo(0, 0);
              }}
              className="text-sm text-gray-400 hover:text-primary transition flex items-center gap-1 group cursor-pointer"
            >
              View all{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherMovies.map((m) => (
              <MovieCard key={m._id} movie={m} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => {
                navigate("/movies");
                scrollTo(0, 0);
              }}
              className="px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full font-semibold shadow-lg shadow-primary/30 cursor-pointer"
            >
              Show more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
