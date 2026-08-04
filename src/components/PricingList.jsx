import React from "react";
import { FaLock } from "react-icons/fa";
import useMovieData from "../context/useMovieData";

const PricingList = () => {
  const { pricingData } = useMovieData();
  return (
    <section className="pricing-section py-20 relative">
      <div className="container">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-center">
          {pricingData.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-[32px] border border-[#2ea8ff] overflow-hidden transition-all duration-300
              
              ${
                item.active
                  ? "active-price bg-gradient-to-b from-[#1eb4ff] to-[#2d67ff] min-h-[540px] shadow-[0_0_40px_rgba(0,174,255,0.5)]"
                  : "bg-[#edf2f4] min-h-[430px] non-active-price"
              }
              `}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-[#020b2d] rounded-full" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-[#020b2d] rounded-full" />

              <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-16">
                <h2
                  className={`text-5xl font-semibold mb-4 ${
                    item.active ? "text-white" : "text-[#228EE5]"
                  }`}
                >
                  {item.title}
                </h2>

                <p
                  className={`text-2xl mb-10 ${
                    item.active ? "text-white" : "text-[#228EE5]"
                  }`}
                >
                  {item.duration}
                </p>

                <div className="w-full border-t border-dashed border-[#228EE5] mb-10" />

                {item.oldPrice && (
                  <h3 className="text-5xl text-white/70 line-through mb-4">
                    {item.oldPrice}
                  </h3>
                )}

                <h3
                  className={`text-6xl font-semibold mb-6 ${
                    item.active ? "text-white" : "text-[#228EE5]"
                  }`}
                >
                  {item.price}
                </h3>

                <p
                  className={`text-lg mb-10 ${
                    item.active ? "text-white" : "text-[#3d4b63]"
                  }`}
                >
                  • Cancel anytime
                </p>

                <button
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl tracking-[4px] uppercase text-sm transition-all duration-300
                  
                  ${
                    item.active
                      ? "bg-[#edf2f4] text-[#228EE5]"
                      : "bg-gradient-to-r from-[#1eb4ff] to-[#2d67ff] text-white"
                  }
                  `}
                >
                  <FaLock />
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingList;
