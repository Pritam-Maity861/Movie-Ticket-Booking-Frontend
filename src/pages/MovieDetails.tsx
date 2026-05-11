import { useParams, useNavigate } from "react-router-dom";
// import { dummyDateTimeData } from "../assets/assets";
import {
  StarIcon,
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  // HeartIcon,
  ArrowLeftIcon,
  TicketIcon,
} from "lucide-react";
import timeFormat from "../lib/timeFormat";
import BlurBackground from "../components/BlurBackground";
// import { useState } from "react";
import MovieCard from "../components/MovieCard";
import { useMovieById, useMovies } from "../hooks/useMovie";
import LoaderAnimation from "../components/LoaderAnimation";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const movie = dummyShowsData.find(
  //   (show) => show._id === id || show.id.toString() === id,
  // );

  const { data: movie, isLoading, isError } = useMovieById(id as string);
  const { data: allmovies } = useMovies();
  // const [selectedDate, setSelectedDate] = useState<string | null>(
  //   Object.keys(dummyDateTimeData)[0],
  // );
  // const [isFavorite, setIsFavorite] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const availableDates = Object.keys(dummyDateTimeData).filter((dateStr) => {
  //   const date = new Date(dateStr);
  //   return date >= today;
  // });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-semibold text-2xl">
        <LoaderAnimation />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-semibold text-2xl">
        Error fetching movie
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-semibold text-2xl">
        Movie not found
      </div>
    );
  }

  const otherMovies = allmovies?.pages
    .flatMap((page) => page.movies)
    .filter((show) => show.id !== movie.id)
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
              src={movie.posterUrl}
              alt={movie.title}
              className="w-72 sm:w-80 lg:w-87.5 rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500 object-cover border border-white/10"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5 mt-4 lg:mt-8 flex-1">
            <p className="text-primary font-bold tracking-widest uppercase text-sm">
              {movie.languages.map((lang) => lang.name).join(",")}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
              {movie.title}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <StarIcon className="w-5 h-5 text-primary fill-primary" />
              <span className="font-semibold text-lg">
                {movie.rating.toFixed(1)}{" "}
                <span className="text-sm text-gray-400 font-normal">
                  ({(movie.rating / 10).toFixed(1)}k Rating)
                </span>
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-2xl text-md md:text-lg">
              {movie.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base font-medium">
              <span className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" /> {timeFormat(movie.duration)}
              </span>
              <span>•</span>
              <span>{movie.genres.map((g) => g.name).join(" | ")}</span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />{" "}
                {new Date(movie.releaseDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 transition rounded-full font-semibold border border-gray-600 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => window.open(movie.trailerUrl, "_blank")}
              >
                <PlayIcon className="w-4 h-4" /> Watch Trailer
              </button>
              <button
                className="px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full font-semibold shadow-lg shadow-primary/30 cursor-pointer"
                onClick={() => {
                  if (id) {
                    navigate(`/movies/${id}/showtimes`);
                  }
                }}
              >
                <p className="flex items-center gap-2">
                  <TicketIcon className="w-4 h-5" /> Buy Tickets
                </p>
              </button>
              {/* <button
                className="p-3 bg-gray-800 hover:bg-gray-700 transition rounded-full border border-gray-600 shadow-lg shadow-primary/30 group cursor-pointer"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <HeartIcon
                  className={`w-5 h-5 transition ${isFavorite ? "text-primary fill-primary" : "text-gray-300 group-hover:text-primary"}`}
                />
              </button> */}
            </div>
          </div>
        </div>
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column: Info */}
            <div className="lg:col-span-2 space-y-12">
              {/* Synopsis Section */}
              <section
                className="animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                  About The Movie
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed lg:text-xl">
                  {movie.description}
                </p>
              </section>

              {/* Cast Section */}
              <section
                className="animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                    Cast & Crew
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {movie.credits.map((credit) => (
                    <div
                      key={credit.id}
                      className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="relative">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${credit.person.name}&backgroundColor=f84565,d63854&fontFamily=Outfit`}
                            alt={credit.person.name}
                            className="w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-colors object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                            {credit.role}
                          </div>
                        </div>
                        <div className="mt-1">
                          <h4 className="font-bold text-sm text-white truncate max-w-30">
                            {credit.person.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate max-w-30">
                            {credit.characterName || credit.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* select date and proced for buy ticket */}
          {/* <section id="buy-ticket" className="animate-fade-in-up mt-10 " style={{ animationDelay: "0.4s" }}>
           <div className="lg:col-span-1 mt-10">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>

                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Select Show Date
                </h3>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {availableDates.map((dateStr) => {
                    const dateObj = new Date(dateStr);
                    const day = dateObj.toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    const dateNum = dateObj.getDate();
                    const month = dateObj.toLocaleDateString("en-US", {
                      month: "short",
                    });
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex flex-col items-center shrink-0 min-w-[70px] py-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">
                          {day}
                        </span>
                        <span className="text-2xl font-black leading-none">
                          {dateNum}
                        </span>
                        <span className="text-[10px] font-bold uppercase mt-1 opacity-70">
                          {month}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-center pt-4">
                  <button className="px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full font-semibold shadow-lg shadow-primary/30 cursor-pointer">
               <p className="flex items-center gap-2"><TicketIcon className="w-4 h-5" /> Buy Tickets</p>
              </button>
                </div>
              </div>
            </div>
          </div>
        </section> */}

          {/* Related Movies Section */}
          <section className="mt-24">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-3xl font-black flex items-center gap-3">
                  <div className="w-2 h-10 bg-primary rounded-full"></div>
                  More Like This
                </h3>
                <p className="text-gray-500 mt-2">
                  Personalized recommendations for you
                </p>
              </div>
              <button
                onClick={() => {
                  navigate("/movies");
                  window.scrollTo(0, 0);
                }}
                className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-bold text-sm group cursor-pointer"
              >
                See all{" "}
                <ArrowLeftIcon className="w-4 h-4 inline ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {otherMovies?.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        </main>

        {/* Related Movies */}
        {/* <div className="mt-20">
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
        </div> */}
      </div>
    </div>
  );
};

export default MovieDetails;
