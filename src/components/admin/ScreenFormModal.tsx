import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAddNewScreen } from "../../hooks/useScreens";

type ScreenModalProps = {
  open: boolean;
  onClose: () => void;
  theaterId: string;
};

const ScreenFormModal = ({ open, onClose, theaterId }: ScreenModalProps) => {
  const addScreen = useAddNewScreen();
  const [form, setForm] = useState({
    name: "",
    rows: "", // Comma separated like A,B,C
    seatsPerRow: 0,
  });

  const isSubmitting = addScreen.isPending;

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.rows || form.seatsPerRow <= 0) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const rowsArray = form.rows
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r !== "");

    const payload = {
      name: form.name,
      theaterId: theaterId,
      rows: rowsArray,
      seatsPerRow: Number(form.seatsPerRow),
    };

    addScreen.mutate(payload, {
      onSuccess: () => {
        toast.success("Screen added successfully!");
        setForm({ name: "", rows: "", seatsPerRow: 0 });
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to add screen");
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
        Add New Screen
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
        <TextField
          label="Screen Name (e.g. Screen 1)"
          fullWidth
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <TextField
          label="Rows (e.g. A,B,C,D)"
          fullWidth
          value={form.rows}
          placeholder="Comma separated row names"
          onChange={(e) => handleChange("rows", e.target.value)}
        />

        <TextField
          label="Seats Per Row"
          type="number"
          fullWidth
          value={form.seatsPerRow || ""}
          onChange={(e) => handleChange("seatsPerRow", e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: "white", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            bgcolor: "var(--color-primary)",
            minWidth: "120px",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": { bgcolor: "var(--color-primary-dark)" },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Save Screen"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreenFormModal;
