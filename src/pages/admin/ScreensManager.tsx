import TheatersList from "../../components/admin/TheatersList";

const ScreensManager = () => {
  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Screen Management
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Select a theater to manage its screens.
            </p>
          </div>
        </div>

        <TheatersList />
      </div>
    </div>
  );
};

export default ScreensManager;
