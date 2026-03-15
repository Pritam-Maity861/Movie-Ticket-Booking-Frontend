import { Link } from "react-router-dom";
import { Clapperboard, HomeIcon, TicketX } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#09090b] text-white relative overflow-hidden px-4 py-20">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-140 h-72 md:h-140 bg-primary/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Decorative Film Strip left */}
      <div className="absolute left-6 top-10 bottom-10 w-8 md:flex flex-col justify-between hidden opacity-[0.03]">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-5 h-8 border-2 border-white rounded-sm"
          ></div>
        ))}
      </div>

      {/* Decorative Film Strip right */}
      <div className="absolute right-6 top-10 bottom-10 w-8 md:flex flex-col justify-between hidden opacity-[0.03] items-end">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-5 h-8 border-2 border-white rounded-sm"
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
        {/* Animated Icon Group */}
        <div className="relative flex items-center justify-center mb-10 group">
          <div className="absolute w-36 h-36 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>

          <div className="relative bg-[#16161a] p-7 rounded-3xl border border-gray-800 shadow-2xl transform shadow-primary/10 -rotate-6 group-hover:rotate-0 transition-all duration-500 ease-in-out z-10">
            <TicketX className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(248,69,101,0.6)]" />
          </div>

          <div className="absolute -bottom-5 -right-5 bg-gray-900 p-4 rounded-2xl border border-gray-800 transform rotate-15 group-hover:rotate-25 transition-all duration-500 ease-in-out z-20">
            <Clapperboard className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        {/* Text content */}
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white via-gray-300 to-gray-800 tracking-tighter mb-4 drop-shadow-sm">
          404
        </h1>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-0.5 w-12 md:w-24 bg-linear-to-r from-transparent to-primary/60 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold tracking-[0.25em] uppercase text-primary drop-shadow-[0_0_10px_rgba(248,69,101,0.3)]">
            Plot Twist!
          </h2>
          <div className="h-0.5 w-12 md:w-24 bg-linear-to-l from-transparent to-primary/60 rounded-full"></div>
        </div>

        <p className="text-gray-400 text-base md:text-lg mb-12 leading-relaxed font-light mx-auto max-w-md">
          It looks like you've wandered off the script!{" "}
          <br className="hidden md:block" />
          You either{" "}
          <span className="text-gray-200 font-medium">
            don't have VIP access
          </span>{" "}
          for this scene or the page was left on the cutting room floor.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link
            to="/"
            className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(248,69,101,0.3)] hover:-translate-y-1 w-full sm:w-auto"
          >
            <HomeIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Homepage
          </Link>
          <Link
            to="/movies"
            className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-transparent border-2 border-gray-800 hover:border-gray-600 hover:bg-white/5 text-gray-300 hover:text-white rounded-full font-medium transition-all w-full sm:w-auto"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
