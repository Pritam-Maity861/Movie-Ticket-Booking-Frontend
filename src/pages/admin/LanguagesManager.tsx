import GenericManager from "../../components/admin/GenericManager";
import {
  useCreateLanguage,
  useDeleteLanguage,
  useLanguages,
  useUpdateLanguage,
} from "../../hooks/useMovie";
import { toast } from "react-hot-toast";

const LanguagesManager = () => {
  const { data: languages, error, isLoading } = useLanguages();
  const { mutate: createLanguage } = useCreateLanguage();
  const { mutate: updateLanguage } = useUpdateLanguage();
  const { mutate: deleteLanguage } = useDeleteLanguage();

  const handleAdd = (name: string) => {
    createLanguage(name, {
      onSuccess: () => toast.success("Language created successfully"),
      onError: () => toast.error("Failed to create language"),
    });
  };

  const handleUpdate = (id: string | number, name: string) => {
    updateLanguage(
      { id: String(id), name },
      {
        onSuccess: () => toast.success("Language updated successfully"),
        onError: () => toast.error("Failed to update language"),
      },
    );
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      deleteLanguage(String(id), {
        onSuccess: () => toast.success("Language deleted successfully"),
        onError: () => toast.error("Failed to delete language"),
      });
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-white text-center">Loading languages...</div>
    );
  if (error)
    return (
      <div className="p-10 text-red-500 text-center">
        Error loading languages
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <GenericManager
        title="Language Management"
        itemType="Language"
        items={languages || []}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default LanguagesManager;
