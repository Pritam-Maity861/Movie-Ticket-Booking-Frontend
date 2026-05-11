import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

interface Genre {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Language {
  id: string;
  name: string;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  releaseDate: string;
  duration: number;
  rating: number;
  genres: Genre[];
  languages: Language[];
  updatedAt: string;
}

const MovieCard = ({
  movie,
  isNewRelease = false,
}: {
  movie: Movie;
  isNewRelease?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 hover:-translate-y-2 transition-all duration-300 w-full group shadow-lg">
      <div className="relative">
        <img
          onClick={() => {
            navigate(`/movies/${movie.id}`);
            scrollTo(0, 0);
          }}
          src={movie.posterUrl}
          alt={movie.title}
          className="h-64 w-full object-cover object-top cursor-pointer rounded-lg"
        />
        {isNewRelease && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
            NEW RELEASE
          </span>
        )}
      </div>
      <p className="font-semibold mt-2 truncate">{movie.title}</p>
      <p className="">
        {new Date(movie.releaseDate).getFullYear()} •{" "}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        • {timeFormat(movie.duration)}
      </p>
      <div className="flex justify-between items-center mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie.id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>
        <p>
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.rating !== undefined ? movie.rating.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
