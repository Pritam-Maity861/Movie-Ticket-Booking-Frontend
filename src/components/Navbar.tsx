import { Link } from "react-router-dom";
import { assets } from "../assets/assets.ts";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
// import { useClerk, UserButton, useUser } from "@clerk/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const { user, isLoaded } = useUser();
  // const { openSignIn } = useClerk();

  return (
    <>
      <div className="top-0 fixed w-full z-50 left-0 flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
        <Link to="/" className="max-md:flex-1">
          <img src={assets.logo} alt="logo" className="w-40 h-auto" />
        </Link>

        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
            isOpen ? "max-md:w-full" : "max-md:w-0"
          }`}
        >
          <XIcon
            className="md:hidden absolute top-6 right-6 w-6 h-6   cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          <Link
            to="/"
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            className="group relative text-white text-lg font-mono transition-colors duration-300"
          >
            Home
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-red-500 via-pink-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/movies"
            className="group relative text-white text-lg font-mono transition-colors duration-300"
          >
            Movies
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-red-500 via-pink-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/"
            className="group relative text-white text-lg font-mono transition-colors duration-300"
          >
            Theaters
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-red-500 via-pink-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/"
            className="group relative text-white text-lg font-mono transition-colors duration-300"
          >
            Releases
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-red-500 via-pink-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/favorite"
            className="group relative text-white text-lg font-mono transition-colors duration-300"
          >
            Favorites
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-red-500 via-pink-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/about-us"
            className="group relative text-white text-lg font-mono transition-colors duration-300"
          >
            About Us
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-red-500 via-pink-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

          <button className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull cursor-pointer transition rounded-full font-medium">
            Login
          </button>
        </div>
        <MenuIcon
          className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>
    </>
  );
};

export default Navbar;
