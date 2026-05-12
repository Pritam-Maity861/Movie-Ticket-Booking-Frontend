import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMoviesWithoutPagination } from "../hooks/useMovie";

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: movies, isLoading } = useMoviesWithoutPagination();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderMovies = movies?.slice(0, 5) || [];

  const nextSlide = useCallback(() => {
    if (sliderMovies.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % sliderMovies.length);
    }
  }, [sliderMovies.length]);

  const prevSlide = useCallback(() => {
    if (sliderMovies.length > 0) {
      setCurrentIndex(
        (prev) => (prev - 1 + sliderMovies.length) % sliderMovies.length,
      );
    }
  }, [sliderMovies.length]);

  useEffect(() => {
    if (!sliderMovies.length) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [sliderMovies.length, nextSlide]);

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h > 0 ? h + "h " : ""}${m}m`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-white/40 font-medium tracking-[0.2em] uppercase text-xs">
          Initializing Premiere...
        </p>
      </div>
    );
  }

  if (sliderMovies.length === 0) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#09090b]">
      {sliderMovies.map((movie, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0">
              <img
                src={movie.posterUrl}
                alt=""
                className="w-full h-full object-cover object-[center_20%]"
              />
              {/* Advanced Overlays */}
              <div className="absolute inset-0 bg-linear-to-r from-[#09090b] via-[#09090b]/80 to-transparent z-1"></div>
              <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-[#09090b]/20 to-black/20 z-1"></div>
              <div className="absolute inset-0 backdrop-blur-[1px] z-0"></div>
            </div>

            {/* Content Layer */}
            <div className="relative h-full z-20 flex flex-col justify-center px-6 md:px-16 lg:px-32 max-w-5xl">
              <div
                className={`space-y-6 transition-all duration-1000 delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-sm uppercase tracking-widest shadow-lg shadow-primary/40">
                    Trending
                  </div>
                  <div className="h-[2px] w-8 bg-primary/40"></div>
                  <span className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">
                    Now Showing
                  </span>
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-[80px] font-black text-white leading-[0.95] tracking-tighter filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] uppercase">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-white/90">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                    <Calendar size={14} className="text-primary" />
                    {new Date(movie.releaseDate).getFullYear()}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                    <Clock size={14} className="text-primary" />
                    {formatDuration(movie.duration)}
                  </div>
                  <div className="flex items-center gap-2 text-primary tracking-widest uppercase text-xs bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {movie.genres
                      ?.map((g) => g.name)
                      .slice(0, 2)
                      .join(" • ") || "DRAMA"}
                  </div>
                </div>

                <p className="text-gray-300 text-lg md:text-xl line-clamp-3 leading-relaxed max-w-2xl font-medium drop-shadow-md italic opacity-90">
                  "{movie.description}"
                </p>

                <div className="flex flex-wrap items-center gap-5 pt-6">
                  <button
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    className="group flex items-center gap-3 px-10 py-5 bg-primary hover:bg-primary-dull text-white rounded-full font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/40 cursor-pointer"
                  >
                    <Play size={20} fill="currentColor" />
                    BOOK NOW
                  </button>
                  <button
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    className="flex items-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-full font-black backdrop-blur-xl transition-all border border-white/10 cursor-pointer"
                  >
                    <Info size={20} />
                    DETAILS
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-6 z-40">
        <button
          onClick={prevSlide}
          className="hidden md:flex p-3 md:p-5 rounded-full bg-[#09090b]/40 hover:bg-primary text-white border border-white/5 backdrop-blur-sm transition-all group cursor-pointer"
        >
          <ChevronLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <button
          onClick={nextSlide}
          className="hidden md:flex p-3 md:p-5 rounded-full bg-[#09090b]/40 hover:bg-primary text-white border border-white/5 backdrop-blur-sm transition-all group cursor-pointer"
        >
          <ChevronRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* Horizontal Progress Bars */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 w-full max-w-[200px] md:max-w-xs px-10">
        {sliderMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="flex-1 h-1 relative bg-white/10 rounded-full overflow-hidden group cursor-pointer"
          >
            <div
              className={`absolute inset-0 bg-primary transition-all duration-500 ease-out ${index === currentIndex ? "translate-x-0" : "-translate-x-full"}`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
