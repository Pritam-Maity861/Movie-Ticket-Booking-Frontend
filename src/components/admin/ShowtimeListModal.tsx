import { Modal, Box, IconButton, Typography, Button } from "@mui/material";
import { X, Trash2, Calendar, Clock, Film } from "lucide-react";
import {
  useShowtimesByScreenId,
  useDeleteShowtime,
} from "../../hooks/useShowtime";
import LoaderAnimation from "../LoaderAnimation";
import dayjs from "dayjs";
import { type ShowtimeDetail } from "../../services/api/showtime-ep";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "600px" },
  bgcolor: "rgb(17, 24, 39)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: 24,
  p: 4,
  borderRadius: "24px",
  outline: "none",
  maxHeight: "80vh",
  overflowY: "auto",
};

type ShowtimeListModalProps = {
  open: boolean;
  onClose: () => void;
  screenId: string;
  screenName: string;
};

const ShowtimeListModal = ({
  open,
  onClose,
  screenId,
  screenName,
}: ShowtimeListModalProps) => {
  const {
    data: showtimes,
    isLoading,
    isError,
  } = useShowtimesByScreenId(screenId);
  const { mutateAsync: deleteShowtime } = useDeleteShowtime();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this showtime?")) {
      try {
        await deleteShowtime(id);
      } catch (error) {
        console.error("Error deleting showtime:", error);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} className="scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h5" className="text-white font-bold">
              Showtimes for {screenName}
            </Typography>
            <Typography variant="body2" className="text-white/40">
              Manage scheduled shows for this screen
            </Typography>
          </div>
          <IconButton
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X size={24} />
          </IconButton>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoaderAnimation />
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-400">
            Error loading showtimes.
          </div>
        ) : showtimes && showtimes.length > 0 ? (
          <div className="space-y-4">
            {showtimes.map((showtime: ShowtimeDetail) => {
              const isExpired = dayjs(showtime.startTime).isBefore(dayjs());
              return (
                <div
                  key={showtime.id}
                  className={`p-4 border border-white/10 rounded-xl bg-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors ${isExpired ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <Film className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Typography className="text-white font-semibold">
                          {showtime.movie?.title}
                        </Typography>
                        {isExpired && (
                          <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-500 rounded-full border border-red-500/30 font-bold uppercase tracking-wider">
                            Expired
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-white/40 text-xs text-nowrap">
                          <Calendar size={12} />
                          {dayjs(showtime.startTime).format("MMM DD, YYYY")}
                        </div>
                        <div className="flex items-center gap-1 text-white/40 text-xs text-nowrap">
                          <Clock size={12} />
                          {dayjs(showtime.startTime).format("hh:mm A")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(showtime.id)}
                    className="p-2 text-white/40 hover:text-primary transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-white/40">
            No showtimes scheduled for this screen.
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button
            onClick={onClose}
            className="text-white/60 hover:text-white normal-case font-medium"
          >
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ShowtimeListModal;
