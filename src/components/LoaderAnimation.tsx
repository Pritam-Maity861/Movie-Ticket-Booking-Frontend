import { Film } from "lucide-react"

const LoaderAnimation = () => {
  return (
   <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#09090b]">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute w-32 h-32 border border-primary/20 rounded-full"></div>

          {/* Inner ring track */}
          <div className="absolute w-24 h-24 border-2 border-primary/10 rounded-full"></div>

          {/* Spinning ring */}
          <div className="absolute w-24 h-24 border-2 border-primary rounded-full border-t-transparent animate-spin"></div>

          {/* Pulsing Film Icon */}
          <div className="relative animate-pulse">
            <Film className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(248,69,101,0.6)]" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 z-10">
          <h2 className="text-sm font-medium tracking-[0.4em] text-white/80 uppercase animate-pulse">
            Loading...
          </h2>
          <div className="flex gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
  )
}

export default LoaderAnimation