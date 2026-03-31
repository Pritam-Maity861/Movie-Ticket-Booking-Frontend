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

const MovieCard = ({ movie }: { movie: Movie }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/movies/${movie.id}`);
          scrollTo(0, 0);
        }}
        src={movie.posterUrl}
        alt=""
        className="h-64 w-full object-cover object-top cursor-pointer rounded-lg"
      />
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
