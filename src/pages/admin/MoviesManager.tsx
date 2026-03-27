import { Button } from "@mui/material";
import { useState } from "react"
import MovieFormModal from "../../components/admin/MovieFormModal";
import { Plus } from "lucide-react";
import MovieList from "../../components/admin/MovieList";

const MoviesManager = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Movie Management
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage and organize your Movies
          </p>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500"></div>
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Plus className="text-primary" size={20} />
          Create New Movie
        </h2>
        <div className="flex justify-center pb-2">
        <Button className="h-12 w-35" variant="contained" onClick={handleOpen} sx={{
              bgcolor: "var(--color-primary)",
              "&:hover": { bgcolor: "var(--color-primary)", opacity: 0.9 },
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 8px 16px -4px rgba(248, 69, 101, 0.3)",
              "&.Mui-disabled": {
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.2)",
              },
            }}>
            Add Movie
        </Button>
        </div>
        {/* modal component */}
        <MovieFormModal open={open} onClose={handleClose}/>
        </div>
        
          <MovieList/>
    </div>
    </div>

    
  )
}

export default MoviesManager