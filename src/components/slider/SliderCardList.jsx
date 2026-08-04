import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./Slider.css";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaPlus, FaArrowRight } from "react-icons/fa";
import useMovieData from "../../context/useMovieData";
import { IMAGE_BASE_URL, fetchMovieGenres, fetchSeriesGenres } from "../../utility/useMovies";

const SliderCardList = ({
  title,
  linksText = "",
  sliderId,
  sliderType = "trends",
  linkShare = "/",
  dataApi
}) => {
  const { categories, savedCollectionMovies, toggleCollectionMovie } = useMovieData();
  const [categoryList, setCategoryList] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [filteredData, setFilteredData] = useState(dataApi || []);

  useEffect(() => {
    setFilteredData(dataApi);
  }, [dataApi]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        if (sliderType === "series") {
          const genres = await fetchSeriesGenres();
          setCategoryList(genres);
        } else {
          const genres = await fetchMovieGenres();
          setCategoryList(genres);
        }
      } catch (error) {
        setCategoryList([]);
      }
    };

    loadGenres();
  }, [sliderType, categories]);

  useEffect(() => {
    if (!activeCategoryId || typeof activeCategoryId !== "number") {
      setFilteredData(dataApi);
      return;
    }

    const filtered = dataApi.filter((item) =>
      Array.isArray(item.genre_ids) ? item.genre_ids.includes(activeCategoryId) : false
    );
    setFilteredData(filtered);
  }, [activeCategoryId, dataApi]);

  const handleActiveCat = (categoryId) => {
    setActiveCategoryId((current) => (current === categoryId ? null : categoryId));
  };

  const displayCategories = categoryList;
  const savedCollectionIds = savedCollectionMovies.map((collection) => collection.id);
  const imageURL = IMAGE_BASE_URL;

  return (
    <section className="py-10 relative slider-component">
      <div className="container">
        <div className="flex items-center mb-10 justify-between w-full title-links relative z-1">
          <h2 className="text-5xl text-white font-semibold capitalize">{title}</h2>
          {linksText.length > 0 && (
            <Link
              to={linkShare}
              className="flex items-center justify-center gap-3 text-blue-500 text-md font-medium"
            >
              {linksText} <FaArrowRight size={"14px"} />
            </Link>
          )}
        </div>
        {displayCategories.length > 0 ? (
          <div className="flex items-center justify-between mb-10 relative z-1">
            <button className={`${sliderId}-prev text-white text-2xl`}>
              ❮
            </button>

            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide flex-wrap justify-center">
              <button
                onClick={() => handleActiveCat(null)}
                className={`${
                  activeCategoryId === null ? "bg-pink-500 text-white active-btn" : "bg-transparent"
                } px-6 py-2 rounded-full border border-pink-500 hover:bg-pink-500 text-white whitespace-nowrap outline-none transition duration-300`}
              >
                All
              </button>
              {displayCategories.map((category) => {
                const categoryId = typeof category === "object" ? category.id : category;
                const categoryName = typeof category === "object" ? category.name : category;
                return (
                  <button
                    key={categoryId}
                    onClick={() => handleActiveCat(categoryId)}
                    className={`${
                      activeCategoryId === categoryId ? "bg-pink-500 text-white active-btn" : "bg-transparent"
                    } px-6 py-2 rounded-full border border-pink-500 hover:bg-pink-500 text-white whitespace-nowrap outline-none transition duration-300`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>

            <button className={`${sliderId}-next text-white text-2xl`}>
              ❯
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-300 mb-8">No categories found.</div>
        )}
      </div>
      <div className="ml-8 swipper-wrapper-box">
        {filteredData.length === 0 ? (
          <div className="text-center text-white py-20">No data found.</div>
        ) : (
          <Swiper
            slidesPerView={6}
            spaceBetween={25}
            navigation={{
              nextEl: `.${sliderId}-next`,
              prevEl: `.${sliderId}-prev`,
            }}
            modules={[Navigation]}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 6 },
            }}
          >
            {filteredData.map((item) => {
              const isSaved = savedCollectionIds.includes(item.id);
              return (
                <SwiperSlide key={item.id}>
                  <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                    <Link to={`/${title}/${item.id}`}>
                      <img
                        loading="lazy"
                        decoding="async"
                        src={`${imageURL}${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full h-[280px] object-cover rounded-2xl transition duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="absolute z-0 inset-0 bg-black/15 pointer-events-none"></div>
                    <button
                      type="button"
                      onClick={() => toggleCollectionMovie(item)}
                      className={`absolute top-3 left-3 w-11 h-11 rounded-xl backdrop-blur-md flex items-center justify-center text-xl transition ${
                        isSaved ? "bg-blue-500 text-white" : "bg-black/60 text-white"
                      }`}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default SliderCardList;
