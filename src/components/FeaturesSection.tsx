import { useNavigate } from "react-router-dom";
import BlurBackground from "./BlurBackground"
import { dummyShowsData } from "../assets/assets";
import MovieCard from "./MovieCard";

const FeaturesSection = () => {
    const navigate=useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
        <div className="relative flex items-center justify-between  pt-20 pb-10 ">
            <BlurBackground top="0" right="-80px"/>
         <p className="text-gray-300 text-lg font-medium ">Now Showing</p> 
         <button onClick={()=>navigate("/movies")} className="flex items-center text-gray-300 cursor-pointer">View All →</button>  
        </div>

        <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
            {dummyShowsData.slice(0,8).map((show)=>(
                <MovieCard key={show._id} movie={show}/>
            ))}
        </div>
        <div className="flex justify-center mt-20">
            <button onClick={()=>{navigate("/movies");scrollTo(0,0)}}  className="px-4 py-2 sm:px-7 sm:py-3 bg-primary hover:bg-primary-dull cursor-pointer transition rounded-2xl font-medium">
            Show more →
            </button>
            </div>
    </div>
  )
}

export default FeaturesSection