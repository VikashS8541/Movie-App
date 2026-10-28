import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "./Slider.css";
import { Navigation } from "swiper/modules";

const CharacterSlider = ({ title = "Characters & Directors", item }) => {
  const tabSlider = [
    { id: 1, title: "Actors" },
    { id: 2, title: "Directors" },
  ];

  const [activeTab, setActiveTab] = useState(tabSlider[0].id);
  const activeType = tabSlider.find((tab) => tab.id === activeTab)?.title?.toLowerCase() || "";

  const actorItems = item?.credits?.cast?.slice(0, 12) || [];
  const directorItems = item?.credits?.crew?.filter((crew) => crew.job?.toLowerCase() === "director") || [];

  const CharacterFilter = activeType === "directors" ? directorItems : actorItems;

  return (
    <section className="character-cast-slider py-10 relative">
      <div className="container">
        <div className="flex flex-wrap gap-4 items-center mb-6 md:mb-10 justify-between w-full title-links relative z-1">
          <h2 className="text-3xl md:text-5xl text-white font-semibold">{title}</h2>
          {tabSlider.length > 0 && (
            <div className="tab-slider flex items-center justify-center">
              {tabSlider.map((tab) => (
                <button
                  key={tab.id}
                  className={`button-${tab.id} ${
                    activeTab === tab.id ? "bg-blue-500 text-white" : "bg-transparent text-white border-blue-500/40 hover:bg-blue-500/20"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="ml-4 md:ml-8 swipper-wrapper-box">
        <Swiper
          slidesPerView={7}
          spaceBetween={25}
          navigation={false}
          modules={[Navigation]}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 6.7,
            },
          }}
        >
          {CharacterFilter.map((cast) => {
            const imageSrc =
              cast.profile_path
                ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
                : cast.image;
            const name = cast.name || cast.title || "Unknown";
            const subtitle = cast.character || cast.job || cast.type || "";

            return (
              <SwiperSlide key={cast.id || `${name}-${subtitle}`}>
                <div className="flex flex-col items-center justify-center group cursor-pointer">
                  <div className="w-[130px] h-[130px] md:w-[166px] md:h-[166px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-pink-500 transition duration-300">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={imageSrc}
                      alt={name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="mt-4 text-center text-white">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    {subtitle ? <p className="text-sm text-gray-300">{subtitle}</p> : null}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default CharacterSlider;
