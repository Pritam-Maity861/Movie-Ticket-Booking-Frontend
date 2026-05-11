import {
  ArrowLeft,
  Edit,
  List,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import LoaderAnimation from "../LoaderAnimation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDeleteScreen, useGetScreens } from "../../hooks/useScreens";
import ScreenFormModal from "./ScreenFormModal";
import { Button } from "@mui/material";
import ShowTimeFormModal from "./ShowTimeFormModal";

type ScreenListProps = {
  theaterId: string;
  onBack: () => void;
};

const ScreenList = ({ theaterId, onBack }: ScreenListProps) => {
  const { data, isLoading, isError } = useGetScreens(theaterId);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openShowTimeModal, setOpenShowTimeModal] = useState(false);

  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const handleToggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const { mutateAsync: deleteScreen } = useDeleteScreen(theaterId);

  const screens = (data as any) || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredScreens = screens.filter((screen: any) => {
    const searchText = debouncedSearch;
    return screen.name.toLowerCase().includes(searchText);
  });
  console.log(data);

  // const handleShowtime = (screenId: string) => {
  //   toast.error(`Showtime management coming soon! for screenId: ${screenId}`);
  // };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this Screen?")) {
        return;
      }
      await deleteScreen(id);
      toast.success("Screen Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete screen");
    }
  };

  return (
    <div className=" bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group min-h-125">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500"></div>

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer group/back"
          >
            <ArrowLeft
              size={20}
              className="group-hover/back:-translate-x-1 transition-transform"
            />
            <span>Back to Theaters</span>
          </button>

          <Button
            variant="contained"
            onClick={() => setOpenAddModal(true)}
            startIcon={<Plus size={20} />}
            sx={{
              bgcolor: "var(--color-primary)",
              "&:hover": { bgcolor: "var(--color-primary)", opacity: 0.9 },
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add More Screen
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <List className="text-primary" size={20} />
            Screens List
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search screen by name"
              className="w-64 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <LoaderAnimation />
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center py-10">
          <p className="text-red-400">Error fetching screens</p>
        </div>
      )}

      {!isLoading && filteredScreens.length === 0 && (
        <div className="flex items-center justify-center py-20 text-white/40">
          No screens found for this theater.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScreens?.map((screen: any, index: number) => (
          <div
            key={screen.id || index}
            className="p-5 border border-white/10 rounded-2xl backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-colors relative overflow-hidden group flex justify-between items-center"
          >
            <div className="flex flex-col  gap-2">
              <div>
                <h1 className="text-white text-lg font-semibold">
                  {screen?.name}
                </h1>
                <p className="text-white/40 text-sm">
                  <b className="text-primary">Total Seats : </b>
                  {screen?.totalSeats}
                </p>
              </div>
              <div className="">
                <button
                  onClick={() => {
                    setSelectedScreenId(screen.id);
                    setOpenShowTimeModal(true);
                  }}
                  // onClick={()=>handleShowtime(screen?.id as string)}
                  className="text-white/90 hover:text-white bg-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary-dull"
                >
                  Add ShowTime
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="text-white/40 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5"
                onClick={() => handleToggleMenu(screen.id)}
              >
                <MoreVertical size={20} />
              </button>

              {openMenuId === screen.id && (
                <div className="absolute left-100 z-10">
                  <div className="bg-gray-900 border border-white/10 rounded-xl shadow-2xl flex flex-col ">
                    <button className="flex items-center gap-2 text-white/60 hover:text-white p-2 rounded-lg transition-colors cursor-pointer w-full text-left">
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      className="flex items-center gap-2 text-white/60 hover:text-primary p-2 rounded-lg transition-colors cursor-pointer w-full text-left"
                      onClick={() => handleDelete(screen.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ScreenFormModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        theaterId={theaterId}
      />
      {selectedScreenId && (
        <ShowTimeFormModal
          open={openShowTimeModal}
          onClose={() => {
            setOpenShowTimeModal(false);
            setSelectedScreenId(null);
          }}
          screenId={selectedScreenId}
        />
      )}
    </div>
  );
};

export default ScreenList;
