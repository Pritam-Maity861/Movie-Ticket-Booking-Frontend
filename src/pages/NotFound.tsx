import { Link } from "react-router-dom";
import { HomeIcon, TicketX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white relative overflow-hidden px-4 py-20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-140 h-80 md:h-140 bg-primary/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full space-y-6">
        <div className="relative bg-[#16161a] p-6 rounded-3xl border border-gray-800 shadow-2xl shadow-primary/10 -rotate-6">
          <TicketX className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(248,69,101,0.6)]" />
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white via-gray-300 to-gray-800 tracking-tighter">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-widest text-primary">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            The page you are looking for doesn't exist, has been removed, or the link is broken.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded-full font-bold transition-all shadow-lg shadow-primary/20"
          >
            <HomeIcon className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/movies"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-full font-bold transition-all"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

