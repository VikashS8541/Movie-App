import React ,{useEffect, useState} from "react";
import SliderBanner from "../components/slider/SliderBanner";
import SliderCardList from "../components/slider/SliderCardList";
import KidsImage from "../assets/images/children-section.png";
import golden from "../assets/images/golden-globe.png";
import CharacterSlider from "../components/slider/CharacterSlider";
import { Link } from "react-router-dom";
import QueryRelated from "../components/QueryRelated";
import PricingList from "../components/PricingList";
import ContinueWatching from "../components/slider/ContinueWatching";
import useMovieData from "../context/useMovieData";
import { fetchTrendingPosts, fetchTvPosts, fetchPopularPosts, fetchUpcomingPosts } from "../utility/useMovies";

const Home = () => {
  const { studiosImage } = useMovieData();
  const [bannerSlides, setBannerSlides] = useState([]);
  const [upcomingData, setUpcomingData] = useState([]);

const buttonNav = [
  {
    id: 1,
    text: "Watch Movie",
    path: "/",
    className: "blue-btn",
  },

  {
    id: 2,
    text: "More Info",
    path: "/",
    className: "outline-btn",
  },
];

// Trending , Move , Series Fetch Data state
const [trendingData, setTrendingData] = useState([]);
const [movieData, setMovieData] = useState([]);
const [seriesData , setSeriesData] = useState([]);

  // api calling
  useEffect(() => {
    const fetchData = async () => {
      const [trending,movies,series] = await Promise.all([
        fetchTrendingPosts(),
        fetchPopularPosts(),
        fetchTvPosts(),
      ]);

      setTrendingData(trending);
      setBannerSlides(trending.slice(0, 5));
      setMovieData(movies);
      setSeriesData(series);
      const upcoming = await fetchUpcomingPosts();
      setUpcomingData(upcoming);
      // signal that page data has loaded
    };
    fetchData();
  }, []);

  return (
    <>
      <SliderBanner buttonNav={buttonNav} slides={bannerSlides} />
      <SliderCardList sliderType="trends" dataApi={trendingData} linkShare={"/trends"} linksText="See More" title="trends" sliderId="trends-slider" />
      <SliderCardList
        sliderType="movies"
        title="movies"
        dataApi={movieData}
        linksText="See More"
        sliderId="movies-slider"
        linkShare={"/movies"}
      />
      <section className="golden-banner relative py-10">
        <div
          className="golden-text-box bg-cover h-[320px] md:h-[576px] bg-center bg-no-repeat rounded-3xl overflow-hidden relative"
          style={{
            backgroundImage: `url(${golden})`,
          }}
        >
          <h2>Watching Golden Globe 2024 Movies</h2>
        </div>
      </section>
      <SliderCardList
        sliderType="series"
        title="series"
        dataApi={seriesData}
        linksText="See More"
        sliderId="series-slider"
        linkShare={"/series"}
      />
      <PricingList />
      <SliderCardList
        sliderType="movies"
        title="upcoming"
        dataApi={upcomingData}
        linksText="See More"
        sliderId="upcoming-slider"
        linkShare={"/upcoming"}
      />
      <ContinueWatching title="Continue watching" linkShare={"/movies"} linksText="See More" />
      <QueryRelated />
      <section className="studios-section py-10 relative">
        <div className="container">
          <h2 className="text-center text-3xl md:text-5xl mb-8 md:mb-16 font-semibold">Studios</h2>
          <div className="max-w-5xl mx-auto studios-images grid grid-cols-3 sm:grid-cols-5 gap-5 md:gap-10 place-items-center">
              {studiosImage.map((icon)=>(
                <li className="list-none" key={icon.id}><img  loading="lazy" decoding="async" src={icon.image} alt={icon.text}/></li>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
