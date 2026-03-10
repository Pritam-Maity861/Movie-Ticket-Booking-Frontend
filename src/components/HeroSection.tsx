import { Calendar1Icon, ClockIcon } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate=useNavigate();
  return (
    <div className='px-6 flex flex-col items-start justify-center gap-4 md:px-16 lg:px-36 bg-[url("/dhurandhar.png")] bg-cover bg-center h-screen'>
      <img
        src={assets.jioStudioLogo}
        alt=""
        className="max-h-11 lg-h-11 mt-20"
      />
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
      Dhurandhar
      </h1>

      <div className="flex items-center gap-4 md:text-base text-gray-200">
        <span>Action | Crime</span>
        <div className="flex items-center gap-1 ">
            <Calendar1Icon className="w-4.5 h-4.5"/>2025
        </div>
        <div className="flex items-center gap-1 ">
            <ClockIcon className="w-4.5 h-4.5"/>3h 32m
        </div>
      </div>
    <p className="text-gray-200 max-w-md">Dhurandhar (2025) is a high-octane, 3.5-hour IMDb spy thriller directed by Aditya Dhar, following RAW agent Hamza Ali Mazar (Ranveer Singh) as he infiltrates the Lyari underworld in Karachi, Pakistan. The plot centers on dismantling a terror syndicate responsible for major attacks on India, with Hamza becoming a trusted aide to crime lord Rehman Dakait (Akshaye Khanna).</p>
    <button onClick={()=>navigate("/movies")} className="px-4 py-2 sm:px-7 sm:py-3 bg-primary hover:bg-primary-dull cursor-pointer transition rounded-full font-medium">Explore Movies →</button>
    </div>
  );
};

export default HeroSection;
