import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Box,
  TextField,
} from "@mui/material";
import { Delete, Plus } from "lucide-react";
import { useState } from "react";
import { useCreateMovie, useGenres, useLanguages } from "../../hooks/useMovie";
import toast from "react-hot-toast";

type MovieModalProps = {
  open: boolean;
  onClose: () => void;
};

type credits = {
  name: string;
  role: "ACTOR" | "DIRECTOR" | "PRODUCER";
  characterName?: string;
};
// const genres = [
//   { id: "1", name: "Action" },
//   { id: "2", name: "Drama" },
//   { id: "3", name: "Comedy" },
// ];

// const languages = [
//   { id: "1", name: "English" },
//   { id: "2", name: "Hindi" },
// ];

const MovieFormModal = ({ open, onClose }: MovieModalProps) => {
  const { mutate: createMovieApi } = useCreateMovie();
  const { data: genres } = useGenres();
  const { data: languages } = useLanguages();
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseDate: "",
    genreIds: [] as string[],
    languageIds: [] as string[],
    credits: [] as credits[],
    duration: "",
    trailerUrl: "",
    rating: "",
  });

  const [poster, setPoster] = useState<File | null>(null);
  const [previewPoster, setPreviewPoster] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePosterChange = (file: File | null) => {
    setPoster(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPoster(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewPoster(null);
    }
  };
  const addCredit = () => {
    setForm((prev) => ({
      ...prev,
      credits: [
        ...prev.credits,
        { name: "", role: "ACTOR", characterName: "" },
      ],
    }));
  };
  const updateCredit = (index: number, field: string, value: any) => {
    const updated = [...form.credits];
    (updated[index] as any)[field] = value;
    setForm((prev) => ({ ...prev, credits: updated }));
  };

  const removeCredit = (index: number) => {
    const updated = form.credits.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, credits: updated }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("releaseDate", form.releaseDate);
    formData.append("duration", form.duration.toString());
    formData.append("trailerUrl", form.trailerUrl);
    formData.append("rating", form.rating.toString());
    formData.append("genreIds", JSON.stringify(form.genreIds));
    formData.append("languageIds", JSON.stringify(form.languageIds));
    formData.append("credits", JSON.stringify(form.credits));
    if (poster) {
      formData.append("posterUrl", poster);
    }
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
    createMovieApi(formData, {
      onSuccess: (data) => {
        console.log(data);
        toast("Movie created successfully!", { icon: "✅" });
        onClose();
      },
      onError: (error: any) => {
        console.error("FULL ERROR:", error.response?.data);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          backgroundColor: "#111827",
          color: "#fff",
          padding: 2,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
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
        Add New Movie
      </DialogTitle>
      <DialogContent
        className="space-y-6 mt-2"
        sx={{
          py: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
          },

          "& .MuiTextField-root": {
            mb: 1,
          },

          "& .MuiOutlinedInput-root": {
            color: "white",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            transition: "all 0.2s ease-in-out",

            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.1)",
            },

            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },

            "&.Mui-focused fieldset": {
              borderColor: "var(--color-primary)",
              borderWidth: "1px",
            },
          },

          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.5)",
            "&.Mui-focused": {
              color: "var(--color-primary)",
            },
          },

          "& .MuiSelect-icon": {
            color: "rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* title */}
            <TextField
              label="Title"
              fullWidth
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Release Date */}
              <TextField
                type="date"
                fullWidth
                label="Release Date"
                InputLabelProps={{ shrink: true }}
                value={form.releaseDate}
                onChange={(e) => handleChange("releaseDate", e.target.value)}
              />

              {/* Rating */}
              <TextField
                type="number"
                label="Rating (1-10)"
                fullWidth
                value={form.rating}
                onChange={(e) => handleChange("rating", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Genre Multi Select */}
            <FormControl fullWidth>
              <InputLabel>Genres</InputLabel>
              <Select
                multiple
                value={form.genreIds}
                onChange={(e) => handleChange("genreIds", e.target.value)}
                input={<OutlinedInput label="Genres" />}
                renderValue={(selected) => (
                  <Box className="flex flex-wrap gap-1">
                    {selected.map((id) => {
                      const g = genres?.find((x) => x.id === id);
                      return (
                        <Chip
                          key={id}
                          label={g?.name}
                          size="small"
                          sx={{
                            bgcolor: "rgba(248, 69, 101, 0.1)",
                            color: "var(--color-primary)",
                            border: "1px solid rgba(248, 69, 101, 0.2)",
                            fontWeight: 600,
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {genres?.map((g) => (
                  <MenuItem
                    key={g.id}
                    value={g.id}
                    sx={{
                      "&:hover": { bgcolor: "rgba(248, 69, 101, 0.1)" },
                      "&.Mui-selected": {
                        bgcolor: "rgba(248, 69, 101, 0.2)",
                        "&:hover": { bgcolor: "rgba(248, 69, 101, 0.3)" },
                      },
                    }}
                  >
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Language Multi Select */}
            <FormControl fullWidth>
              <InputLabel>Languages</InputLabel>
              <Select
                multiple
                value={form.languageIds}
                onChange={(e) => handleChange("languageIds", e.target.value)}
                input={<OutlinedInput label="Languages" />}
                renderValue={(selected) => (
                  <Box className="flex flex-wrap gap-1">
                    {selected.map((id) => {
                      const l = languages?.find((x) => x.id === id);
                      return (
                        <Chip
                          key={id}
                          label={l?.name}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                            color: "white",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {languages?.map((l) => (
                  <MenuItem
                    key={l.id}
                    value={l.id}
                    sx={{
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.15)" },
                      },
                    }}
                  >
                    {l.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="grid grid-cols-2 gap-4">
              {/* Duration */}
              <TextField
                type="number"
                label="Duration (min)"
                fullWidth
                value={form.duration}
                onChange={(e) =>
                  handleChange("duration", Number(e.target.value))
                }
              />

              {/* Poster Upload Button */}
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  height: "56px",
                  borderRadius: "12px",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    bgcolor: "rgba(248, 69, 101, 0.05)",
                  },
                }}
              >
                Upload Poster
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handlePosterChange(e.target.files?.[0] || null)
                  }
                />
              </Button>
            </div>

            {/* Trailer URL */}
            <TextField
              label="Trailer URL"
              fullWidth
              value={form.trailerUrl}
              onChange={(e) => handleChange("trailerUrl", e.target.value)}
            />
          </div>
        </div>

        {previewPoster && (
          <Box className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6">
            <img
              src={previewPoster}
              alt="Poster Preview"
              className="w-24 h-36 object-cover rounded-xl border border-white/10 shadow-lg"
            />
            <div className="space-y-2">
              <p className="text-sm text-white/60 font-medium">
                Poster Preview
              </p>
              <Button
                size="small"
                variant="text"
                sx={{
                  color: "#ef4444",
                  textTransform: "none",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
                }}
                onClick={() => handlePosterChange(null)}
              >
                Remove Poster
              </Button>
            </div>
          </Box>
        )}

        {/* Credits Section */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Movie Credits
            </h3>
            <Button
              variant="text"
              startIcon={<Plus size={18} />}
              onClick={addCredit}
              sx={{
                color: "var(--color-primary)",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "rgba(248, 69, 101, 0.1)" },
              }}
            >
              Add Credit
            </Button>
          </div>

          <div className="space-y-4">
            {form.credits.map((credit, index) => (
              <Box
                key={index}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="md:col-span-4">
                  <TextField
                    label="Name"
                    fullWidth
                    value={credit.name}
                    onChange={(e) =>
                      updateCredit(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-3">
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      value={credit.role}
                      onChange={(e) =>
                        updateCredit(index, "role", e.target.value)
                      }
                      sx={{
                        "& .MuiSelect-select": {
                          py: "13.5px", // Match TextField height
                        },
                      }}
                    >
                      <MenuItem value="ACTOR">Actor</MenuItem>
                      <MenuItem value="DIRECTOR">Director</MenuItem>
                      <MenuItem value="PRODUCER">Producer</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="md:col-span-4">
                  <TextField
                    label="Character Name"
                    fullWidth
                    value={credit.characterName}
                    onChange={(e) =>
                      updateCredit(index, "characterName", e.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-1 flex justify-center pb-1">
                  <IconButton
                    onClick={() => removeCredit(index)}
                    sx={{
                      color: "#ef4444",
                      bgcolor: "rgba(239, 68, 68, 0.05)",
                      "&:hover": { bgcolor: "rgba(239, 68, 68, 0.15)" },
                      borderRadius: "12px",
                      p: 1.5,
                    }}
                  >
                    <Delete size={20} />
                  </IconButton>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "var(--color-primary)",
            color: "white",
            textTransform: "none",
            fontWeight: 700,
            px: 6,
            py: 1.5,
            borderRadius: "12px",
            boxShadow: "0 8px 20px -6px rgba(248, 69, 101, 0.4)",
            "&:hover": {
              bgcolor: "var(--color-primary)",
              opacity: 0.9,
              boxShadow: "0 8px 25px -6px rgba(248, 69, 101, 0.5)",
            },
          }}
        >
          Save Movie
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieFormModal;
