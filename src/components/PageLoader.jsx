import React from "react";

const PageLoader = () => {
  const text = "MOVIEHORSE";

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-[#070B14] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[150px] animate-pulse" />

      {/* Logo Text */}
      <div className="relative flex">
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-500 to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-shine"
            style={{
              animationDelay: `${index * 0.08}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Loading Text */}
      <div className="mt-8 flex items-center gap-1 text-gray-400 tracking-[6px] uppercase text-sm">
        <span>Loading Movies</span>

        <span className="animate-bounce">.</span>
        <span
          className="animate-bounce"
          style={{ animationDelay: "0.15s" }}
        >
          .
        </span>
        <span
          className="animate-bounce"
          style={{ animationDelay: "0.3s" }}
        >
          .
        </span>
      </div>

      {/* Progress Line */}
      <div className="mt-8 w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 animate-loader-bar" />
      </div>
    </div>
  );
};

export default PageLoader;