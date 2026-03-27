import GenericManager from "../../components/admin/GenericManager";
import {
  useCreateGenre,
  useDeleteGenre,
  useGenres,
  useUpdateGenre,
} from "../../hooks/useMovie";
import { toast } from "react-hot-toast";

const GenresManager = () => {
  const { data: genres, error, isLoading } = useGenres();
  const { mutate: createGenre } = useCreateGenre();
  const { mutate: updateGenre } = useUpdateGenre();
  const { mutate: deleteGenre } = useDeleteGenre();

  const handleAdd = (name: string) => {
    createGenre(name, {
      onSuccess: () => toast.success("Genre created successfully"),
      onError: () => toast.error("Failed to create genre"),
    });
  };

  const handleUpdate = (id: string | number, name: string) => {
    updateGenre(
      { id: String(id), name },
      {
        onSuccess: () => toast.success("Genre updated successfully"),
        onError: () => toast.error("Failed to update genre"),
      },
    );
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      deleteGenre(String(id), {
        onSuccess: () => toast.success("Genre deleted successfully"),
        onError: () => toast.error("Failed to delete genre"),
      });
    }
  };

  if (isLoading)
    return <div className="p-10 text-white text-center">Loading genres...</div>;
  if (error)
    return (
      <div className="p-10 text-red-500 text-center">Error loading genres</div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <GenericManager
        title="Genres Management"
        itemType="Genre"
        items={genres || []}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default GenresManager;
