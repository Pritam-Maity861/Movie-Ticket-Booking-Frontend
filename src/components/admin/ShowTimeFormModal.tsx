import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import toast from "react-hot-toast";
import { useCreateShowtime } from "../../hooks/useShowtime";
import { useMoviesWithoutPagination } from "../../hooks/useMovie";

type ShowTimeModalProps = {
  open: boolean;
  onClose: () => void;
  screenId: string;
};

const ShowTimeFormModal = ({ open, onClose, screenId }: ShowTimeModalProps) => {
  const addShowtime = useCreateShowtime();
  const {
    data: AllMovies,
    isLoading,
    isError,
  } = useMoviesWithoutPagination(open);
  const [form, setForm] = useState({
    movieId: "",
    startTime: null as any, // Dayjs object
    vipSeatPrice: "",
    premiumSeatPrice: "",
    regularSeatPrice: "",
  });

  const isSubmitting = addShowtime.isPending;

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !form.movieId ||
      !form.startTime ||
      !form.vipSeatPrice ||
      !form.premiumSeatPrice ||
      !form.regularSeatPrice
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      movieId: form.movieId,
      screenId: screenId,
      startTime: form.startTime.toISOString(),
      vipSeatPrice: Number(form.vipSeatPrice),
      premiumSeatPrice: Number(form.premiumSeatPrice),
      regularSeatPrice: Number(form.regularSeatPrice),
    };

    addShowtime.mutate(payload, {
      onSuccess: () => {
        toast.success("Showtime created successfully!");
        setForm({
          movieId: "",
          startTime: null,
          vipSeatPrice: "",
          premiumSeatPrice: "",
          regularSeatPrice: "",
        });
        onClose();
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to create showtime",
        );
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          backgroundColor: "#111827",
          color: "#fff",
          padding: 2,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "var(--color-primary)",
          fontWeight: 700,
          fontSize: "1.5rem",
        }}
      >
        Add Showtime
      </DialogTitle>

      <DialogContent
        className="pt-4"
        sx={{
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          "& .MuiOutlinedInput-root": {
            color: "white",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
            "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
          },
          "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
        }}
      >
        {/* Movie ID */}
        {/* <TextField
      
        label="Movie ID"
        fullWidth
        value={form.movieId}
        onChange={(e) => handleChange("movieId", e.target.value)}
      /> */}

        <Box>
          <Autocomplete
            options={AllMovies || []}
            getOptionLabel={(option: any) => option.title || ""}
            value={
              AllMovies?.find((movie: any) => movie.id === form.movieId) || null
            }
            onChange={(_, newValue) => {
              handleChange("movieId", newValue ? newValue.id : "");
            }}
            loading={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Movie"
                placeholder={
                  isError ? "Error loading movies" : "Search movie..."
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-primary)",
                },
              },
              "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
              "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
                color: "rgba(255, 255, 255, 0.6)",
              },
            }}
            ListboxProps={{
              sx: {
                backgroundColor: "#111827",
                color: "white",
                "& .MuiAutocomplete-option": {
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                },
              },
            }}
          />
        </Box>

        {/* Start Time */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Start Time"
            value={form.startTime}
            onChange={(newValue) => handleChange("startTime", newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-primary)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "var(--color-primary)",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255,255,255,0.6)", // calendar icon
                  },
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* Prices */}
        <TextField
          label="VIP Seat Price"
          type="number"
          fullWidth
          value={form.vipSeatPrice}
          onChange={(e) => handleChange("vipSeatPrice", e.target.value)}
        />

        <TextField
          label="Premium Seat Price"
          type="number"
          fullWidth
          value={form.premiumSeatPrice}
          onChange={(e) => handleChange("premiumSeatPrice", e.target.value)}
        />

        <TextField
          label="Regular Seat Price"
          type="number"
          fullWidth
          value={form.regularSeatPrice}
          onChange={(e) => handleChange("regularSeatPrice", e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: "white", textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{
            bgcolor: "var(--color-primary)",
            minWidth: "120px",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": { bgcolor: "var(--color-primary-dark)" },
          }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={20} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowTimeFormModal;
