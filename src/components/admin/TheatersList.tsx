import { Edit, List, MoreVertical, Trash2 } from "lucide-react";
import LoaderAnimation from "../LoaderAnimation";
import { useEffect, useState } from "react";
import { useDeleteTheater, useGetTheaters } from "../../hooks/useTheaters";
import toast from "react-hot-toast";
import ScreenList from "./ScreenList";

const TheatersList = () => {
  const { data, isLoading, isError } = useGetTheaters();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(
    null,
  );
  const [showScreens, setShowScreens] = useState(false);

  const handleToggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const { mutateAsync: deleteTheater } = useDeleteTheater();

  const theaters = data || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTheaterClick = (id: string) => {
    setSelectedTheaterId(id);
    setShowScreens(true);
  };

  const handleBackToTheaters = () => {
    setShowScreens(false);
    setSelectedTheaterId(null);
  };

  const filteredTheaters = theaters.filter((theater) => {
    const searchText = debouncedSearch;

    return (
      theater.name.toLowerCase().includes(searchText) ||
      theater.city.toLowerCase().includes(searchText) ||
      theater.address.toLowerCase().includes(searchText)
    );
  });

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this theater?")) {
        return;
      }
      await deleteTheater(id);
      toast.success("theater Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete theater");
    }
  };

  if (showScreens && selectedTheaterId) {
    return (
      <ScreenList theaterId={selectedTheaterId} onBack={handleBackToTheaters} />
    );
  }

  return (
    <div className=" bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group min-h-125">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500"></div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <List className="text-primary" size={20} />
          Theaters List
        </h2>
        {/* search section */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search movie by title"
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={handleSearch}
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
          <LoaderAnimation />
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center">
          <p>Error fetching theaters</p>
        </div>
      )}
      {filteredTheaters?.map((theater, index) => (
        <div
          key={theater.id || index}
          onClick={() => handleTheaterClick(theater.id)}
          className="m-2 mb-2 p-5 border border-white/10 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-colors cursor-pointer shadow-2xl relative overflow-hidden group flex gap-8 flex-row"
        >
          <div className="">
            <h1 className="text-white text-lg font-semibold">
              {theater?.name}
            </h1>
            <p className="text-white/40 text-sm">
              <b className="text-primary">City : </b>
              {theater?.city}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Address : </b>
              {theater?.address}
            </p>
            <p className="text-white/40 text-sm">
              <b className="text-primary">Rating : </b>
              {theater?.ratting !== null ? theater?.ratting : "N/A"}
            </p>
          </div>
          {/* three dots */}
          <div className="">
            <button
              className="text-white/40 hover:text-white transition-colors absolute top-6 right-6 cursor-pointer"
              onClick={(e) => handleToggleMenu(theater.id, e)}
            >
              <MoreVertical size={20} />
            </button>
            {/* menu */}
            {openMenuId === theater.id && (
              <div className="absolute top-10 right-6 z-20">
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-2 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                  <div className="flex flex-col gap-2">
                    <button
                      className="text-white/40 hover:text-white transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); /* edit logic */
                      }}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-white/40 hover:text-primary transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(theater.id);
                      }}
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
    </div>
  );
};

export default TheatersList;
