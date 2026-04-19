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
import { useAddNewTheater } from "../../hooks/useTheaters";

type TheaterModalProps = {
  open: boolean;
  onClose: () => void;
};

const TheaterFormModal = ({ open, onClose }: TheaterModalProps) => {
  const addTheater = useAddNewTheater();
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
  });

  const isSubmitting = addTheater.isPending;

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if(!form.name || !form.city|| !form.address){
        toast.error("Please fill in all required fields");
        return;
    }

    const payload = {
      name: form.name,
      city: form.city,
      address: form.address,
    };

    addTheater.mutate(payload, {
      onSuccess: (data) => {
        console.log(data);
        toast.success("Theater added successfully!");
        setForm({ name: "", city: "", address: ""});
        onClose();
      },
      onError: (error: any) => {
        console.error("FULL ERROR:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to add theater");
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm" // Theaters need less space than Movies
      
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
        Add New Theater
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
          label="Theater Name"
          fullWidth
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

          <TextField
            label="City"
            fullWidth
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />

        <TextField
          label="Full Address"
          fullWidth
          multiline
          rows={3}
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
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
            "Save Theater"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TheaterFormModal;
