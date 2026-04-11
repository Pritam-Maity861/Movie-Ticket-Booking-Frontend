import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovieById } from "../hooks/useMovie";
import { useShowtimes } from "../hooks/useShowtime";
import {
  CalendarIcon,
  MapPinIcon,
  MapPinned,
  CircleCheckBigIcon,
} from "lucide-react";
import BlurBackground from "../components/BlurBackground";
import LoaderAnimation from "../components/LoaderAnimation";

const MovieShowtimes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading: isMovieLoading } = useMovieById(id as string);

  // Create dates for the next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

 

  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);

  // Format date for API (YYYY-MM-DD or ISO)
  const formattedDate = selectedDate.toISOString();

  const { data: theaterShowtimes, isLoading: isShowtimesLoading } =
    useShowtimes(id as string, formattedDate);

  if (isMovieLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoaderAnimation />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Movie not found
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 text-white bg-black relative">
      <BlurBackground top="10%" left="0%" />
      <BlurBackground bottom="10%" right="0%" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header Section */}
        <header className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                {movie.title} - <span className="text-primary">Showtimes</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 font-medium">
                <span className="px-2 py-0.5 border border-white/20 rounded text-xs">
                  UA
                </span>
                <span>{movie.genres.map((g) => g.name).join(", ")}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>{movie.languages.map((l) => l.name).join(", ")}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Date Selector */}
        <section
          className="mb-12 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {dates.map((date) => {
              const isSelected =
                selectedDate.toDateString() === date.toDateString();
              const dayName = date.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const dayNum = date.getDate();
              const month = date.toLocaleDateString("en-US", {
                month: "short",
              });

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center shrink-0 min-w-[80px] p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105"
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">
                    {dayName}
                  </span>
                  <span className="text-2xl font-black leading-none">
                    {dayNum}
                  </span>
                  <span className="text-[10px] font-bold uppercase mt-1 opacity-70">
                    {month}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="font-bold text-2xl  mt-4">
            Available <span className="text-primary ">Showtimes</span> for  <span className="text-primary">selected date</span>
          </div>
        </section>

        {/* Showtimes List */}
        <section
          className="space-y-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {isShowtimesLoading ? (
            <div className="py-24 flex justify-center">
              <LoaderAnimation />
            </div>
          ) : theaterShowtimes && theaterShowtimes.length > 0 ? (
            theaterShowtimes.map((theater) => (
              <div
                key={theater.theaterId}
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/8 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-primary/10 rounded-2xl text-primary mt-1 shadow-inner">
                      <MapPinIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                        {theater.theaterName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded">
                          <MapPinned className="w-3.5 h-3.5" /> {theater.city} <span className="w-1 h-1 bg-white/20 rounded-full"></span> {theater.address}
                        </span>
                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded">
                          <CircleCheckBigIcon className="w-3.5 h-3.5 text-green-500" />{" "}
                          {theater.ratting}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-6 border-t border-white/5">
                  {theater.screens.map((screen) => (
                    <div key={screen.screenId} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                          {screen.screenName}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {screen.showtimes.map((showtime) => {
                          const showDate = new Date(showtime.startTime);
                          const time = showDate
                            .toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .toLowerCase();

                          return (
                            <button
                              key={showtime.showtimeId}
                              onClick={() =>
                                navigate(
                                  `/movies/${id}/${showtime.showtimeId}/${formattedDate}`,
                                )
                              }
                              className="group/time relative px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 font-black text-sm cursor-pointer shadow-sm hover:shadow-primary/10"
                            >
                              {time}
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-black text-[10px] rounded shadow-2xl opacity-0 group-hover/time:opacity-100 transition-all transform scale-90 group-hover/time:scale-100 pointer-events-none whitespace-nowrap font-black z-50">
                                SELECT SEATS
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm">
              <div className="inline-flex p-5 rounded-full bg-white/5 mb-6 shadow-inner">
                <CalendarIcon className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-300">
                No shows found
              </h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                There are no showtimes available for the selected date. Please
                check back later or try another day.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MovieShowtimes;
