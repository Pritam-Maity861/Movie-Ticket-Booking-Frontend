import React, { useState } from "react";
import { Plus, Trash2, Edit2, Search, Tag, X, Check } from "lucide-react";
import {
  TextField,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
} from "@mui/material";

interface Item {
  id: string | number;
  name: string;
  createdAt: string;
}

interface GenericManagerProps {
  title: string;
  itemType: string;
  items: Item[];
  onAdd: (name: string) => void;
  onUpdate: (id: string | number, name: string) => void;
  onDelete: (id: string | number) => void;
}

const GenericManager = ({
  title,
  itemType,
  items,
  onAdd,
  onUpdate,
  onDelete,
}: GenericManagerProps) => {
  const [newItemName, setNewItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAdd(newItemName.trim());
    setNewItemName("");
  };

  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdateItem = () => {
    if (!editingId || !editingName.trim()) return;
    onUpdate(editingId, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage and organize your {itemType}s
          </p>
        </div>
      </div>

      {/* Create Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500"></div>

        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Plus className="text-primary" size={20} />
          Create New {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </h2>

        <form
          onSubmit={handleAddItem}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <TextField
              fullWidth
              placeholder={`Enter ${itemType} name...`}
              variant="outlined"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-primary)",
                  },
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.3)",
                  opacity: 1,
                },
              }}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={!newItemName.trim()}
            startIcon={<Plus size={18} />}
            sx={{
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
            }}
          >
            Create {itemType}
          </Button>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Active {title}</h2>

          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} className="text-white/40" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: "240px" },
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-primary)",
                },
                backgroundColor: "rgba(255, 255, 255, 0.02)",
              },
            }}
          />
        </div>

        <TableContainer
          component={Paper}
          sx={{ bgcolor: "transparent", boxShadow: "none" }}
        >
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    color: "rgba(255, 255, 255, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.05)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  },
                }}
              >
                <TableCell>Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    "& td": {
                      color: "rgba(255, 255, 255, 0.8)",
                      borderColor: "rgba(255, 255, 255, 0.05)",
                    },
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02)" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    {editingId === item.id ? (
                      <TextField
                        size="small"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": {
                              borderColor: "var(--color-primary)",
                              borderRadius: "8px",
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Tag size={16} className="text-primary" />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-1">
                      {editingId === item.id ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton
                              size="small"
                              onClick={handleUpdateItem}
                              sx={{
                                color: "#10b981",
                                "&:hover": {
                                  bgcolor: "rgba(16, 185, 129, 0.1)",
                                },
                              }}
                            >
                              <Check size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              size="small"
                              onClick={cancelEditing}
                              sx={{
                                color: "#f87171",
                                "&:hover": {
                                  bgcolor: "rgba(248, 113, 113, 0.1)",
                                },
                              }}
                            >
                              <X size={16} />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => startEditing(item)}
                              sx={{
                                color: "white",
                                "&:hover": {
                                  bgcolor: "rgba(255, 255, 255, 0.05)",
                                },
                              }}
                            >
                              <Edit2 size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => onDelete(item.id)}
                              sx={{
                                color: "#f87171",
                                "&:hover": {
                                  bgcolor: "rgba(248, 113, 113, 0.1)",
                                },
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      py: 10,
                      color: "white/20",
                      borderColor: "transparent",
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search size={40} className="mb-2 opacity-10" />
                      <p>No {itemType}s found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default GenericManager;
