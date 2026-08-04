import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./Slider.css";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../utility/useMovies";

const CollectionSlider = ({ title, linkShare = "/collection", collectionsData = [] }) => {
  const collections = Array.isArray(collectionsData) ? collectionsData : [];

  const getItemRoute = (item) => {
    if (!item) return linkShare;
    if (item.parts && Array.isArray(item.parts)) return linkShare;
    if (item.name && !item.title && !item.media_type) return "/collection";

    const type = item.media_type?.toLowerCase();
    if (type === "tv" || type === "series") return "/series";
    if (type === "movie") return "/movies";
    if (item.first_air_date && !item.title) return "/series";
    return "/movies";
  };

  if (collections.length === 0) {
    return (
      <section className="py-10 relative collection-slider">
        <div className="container text-center text-white py-20">
          No collection items found.
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 relative collection-slider">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-10 justify-between w-full title-links relative z-1 gap-5">
          <div>
            <h2 className="text-5xl text-white font-semibold">{title}</h2>
          </div>
        </div>
      </div>

      <div className="ml-8 swipper-wrapper-box">
        <Swiper
          slidesPerView={5}
          spaceBetween={25}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {collections.map((collect) => {
            const imageSrc =
              collect.poster_path
                ? `${IMAGE_BASE_URL}${collect.poster_path}`
                : collect.backdrop_path
                ? `${IMAGE_BASE_URL}${collect.backdrop_path}`
                : collect.image || "";
            const titleText = collect.name || collect.title || "Collection";

            return (
              <SwiperSlide key={collect.id}>
                <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
                  <Link to={`${getItemRoute(collect)}/${collect.id}`}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={imageSrc}
                      alt={titleText}
                      className="w-full h-[300px] object-cover rounded-[32px] transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="absolute z-0 inset-0 bg-black/15 pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-semibold">{titleText}</h3>
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

export default CollectionSlider;
