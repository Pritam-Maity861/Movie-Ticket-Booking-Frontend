import { Edit, List, MoreVertical, Trash2 } from "lucide-react";
import { useDeleteMovie, useMovies } from "../../hooks/useMovie";
import LoaderAnimation from "../LoaderAnimation";
import { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";
import MovieFormModal from "./MovieFormModal";

const MovieList = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies();

  const { mutateAsync: deleteMovie } = useDeleteMovie();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const handleToggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };
  // console.log(data);
  const observerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const handleOpen = (movie?: any) => {
    if (movie) setSelectedMovie(movie);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedMovie(null);
    setOpen(false);
  };

  //flatten pages
  const movies = data?.pages.flatMap((page) => page.movies) || [];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredMovies = movies.filter((movie) => {
    const searchText = debouncedSearch;

    return movie.title.toLowerCase().includes(searchText);
    // ||movie.description.toLowerCase().includes(searchText) ||
    // movie.languages.some((lang) =>
    //   lang.name.toLowerCase().includes(searchText)
    // ) ||
    // movie.genres.some((genre) =>
    //   genre.name.toLowerCase().includes(searchText)
    // ) ||
    // movie.credits.some((credit) =>
    //   credit.person.name.toLowerCase().includes(searchText)
    // )
  });
  const handleDelete = async (id: string) => {
    try {
      //confarmation for delete movie
      if (!confirm("Are you sure you want to delete this movie?")) {
        return;
      }
      await deleteMovie(id);
      // toast.success("Movie Deleted Successfully");
    } catch (error) {
      console.log(error);
      // toast.error("Failed to delete movie");
    }
  };
  return (
    <div className=" bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group min-h-[500px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500"></div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <List className="text-primary" size={20} />
          Movie List
        </h2>
        {/* search section */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search movie by title"
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={handleSearch}
          />
          {/* <button className="px-4 py-2 rounded-lg bg-primary text-white" >Search</button> */}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
          <LoaderAnimation />
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center">
          <p>Error fetching movies</p>
        </div>
      )}
      {filteredMovies?.map((movie, index) => (
        <div
          key={movie.id || index}
          className="m-2 mb-2 p-2 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden group flex gap-8 flex-row"
        >
          {/* poster */}
          <div className="">
            <img
              src={movie.posterUrl}
              className="w-35 h-55 rounded-lg"
              alt=""
            />
          </div>
          <div className="">
            <h1 className="text-white text-lg font-semibold">{movie?.title}</h1>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Description : </b>
              {movie?.description}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Release Date : </b>
              {new Date(movie?.releaseDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Duration : </b>
              {movie?.duration}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Rating : </b>
              {movie?.rating}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Languages : </b>
              {movie?.languages.map((lang) => lang.name).join(", ")}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Genres : </b>
              {movie?.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Credits : </b>
              {movie?.credits.map((credit) => credit.person.name).join(", ")}
            </p>
          </div>
          {/* three dots */}
          <div className="">
            {/* onclick the options will be shown */}

            <button
              className="text-white/40 hover:text-white transition-colors absolute top-6 right-6 cursor-pointer"
              onClick={() => handleToggleMenu(movie.id)}
            >
              <MoreVertical size={20} />
            </button>
            {/* menu */}
            {openMenuId === movie.id && (
              <div className="absolute top-10 right-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                  <div className="flex flex-col gap-2">
                    <button
                      className="text-white/40 hover:text-white transition-colors cursor-pointer"
                      onClick={() => handleOpen(movie)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-white/40 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => handleDelete(movie.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage ? (
          <LoaderAnimation />
        ) : (
          <div>
            {hasNextPage ? "Loading more..." : "No more movies available"}
          </div>
        )}
      </div>

      <MovieFormModal
        open={open}
        onClose={handleClose}
        isEdit={!!selectedMovie}
        initialData={selectedMovie || null}
      />
    </div>
  );
};

export default MovieList;
