import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.ts";

const Footer = () => {
  const navigate=useNavigate();
  return (
    <footer className="px-6 pt-8 md:px-16 lg:px-36 w-full text-gray-300 mt-20">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
        <div className="md:max-w-96">
          <img
            alt="logo"
            className="h-11"
            src={assets.logo}
          />

          <p className="mt-6 text-sm">
            We are dedicated to providing the best and most seamless cinematic experience for movie enthusiasts everywhere! Catch the latest blockbusters, discover hidden gems, and book your seats in just a few clicks.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
              alt="google play"
              className="h-10 w-auto border border-white rounded"
            />
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg"
              alt="app store"
              className="h-10 w-auto border border-white rounded"
            />
          </div>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2 cursor-pointer">
              <li><a onClick={()=>{navigate("/"); scrollTo(0,0)}}>Home</a></li>
              <li><a onClick={()=>{navigate("/movies"); scrollTo(0,0)}}>Movies</a></li>
              <li><a  onClick={()=>{navigate("/releases"); scrollTo(0,0)}}>Releases</a></li>
              <li><a  onClick={()=>{navigate("/about-us"); scrollTo(0,0)}}>About Us</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+91 8159028218</p>
              <p>maitypritam861@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} ©{" "}
        <a href="">chobiGhor</a>. All Right Reserved.
      </p>
    </footer>
  )
}

export default Footer