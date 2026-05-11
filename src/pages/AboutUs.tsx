import BlurBackground from "../components/BlurBackground";

const AboutUs = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white">
      <BlurBackground />
      <div className="px-6 md:px-16 lg:px-36 py-32 relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 font-mono">
          About{" "}
          <span className="bg-linear-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Us
          </span>
        </h1>
        <p className="text-gray-300 max-w-3xl text-lg md:text-xl leading-relaxed mb-12">
          Welcome to our movie ticket booking platform. We are dedicated to
          providing the best and most seamless cinematic experience for movie
          enthusiasts everywhere! Catch the latest blockbusters, discover hidden
          gems, and book your seats in just a few clicks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Our Mission
            </h3>
            <p className="text-gray-400">
              To revolutionize the way you watch and book movies by offering a
              user-friendly, hassle-free booking platform.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Why Choose Us
            </h3>
            <p className="text-gray-400">
              We offer real-time tracking, exclusive seat reservations,
              incredible deals, and an unparalleled digital experience crafted
              just for you.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Get In Touch
            </h3>
            <p className="text-gray-400">
              Have questions? We're available 24/7 to support our community of
              movie lovers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
