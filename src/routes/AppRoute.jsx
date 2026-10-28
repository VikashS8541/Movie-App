import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import PageLoader from "../components/PageLoader";

// Lazy Loading
const Home = lazy(() => import("../pages/Home"));
const Pricing = lazy(() => import("../pages/Pricing"));
const Movies = lazy(() => import("../pages/Movies"));
const Series = lazy(() => import("../pages/Series"));
const Collection = lazy(() => import("../pages/Collection"));
const FAQ = lazy(() => import("../pages/FAQ"));
const NotFound = lazy(() => import("../pages/NotFound"));
const SingleCollection = lazy(() => import("../pages/SingleCollection"));
const SingleMovie = lazy(() => import("../pages/SingleMovie"));
const SingleSeries = lazy(() => import("../pages/SingleSeries"));
const Trends = lazy(() => import("../pages/Trends"));
const SingleTrend = lazy(() => import("../pages/SingleTrend"));
const Upcoming = lazy(() => import("../pages/Upcoming"));
const SingleUpcoming =lazy(() => import("../pages/SingleUpcoming"));

const AppRoute = () => {
  return (
    <Suspense fallback={<PageLoader/>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="pricing" element={<Pricing />} />

          <Route path="movies">
            <Route index element={<Movies />} />
            <Route path=":id" element={<SingleMovie />} />
          </Route>

          <Route path="trends">
            <Route index element={<Trends />} />
            <Route path=":id" element={<SingleTrend />} />
          </Route>

          <Route path="upcoming">
            <Route index element={<Upcoming />} />
            <Route path=":id" element={<SingleUpcoming />} />
          </Route>

          <Route path="series">
            <Route index element={<Series />} />
            <Route path=":id" element={<SingleSeries />} />
          </Route>

          <Route path="collection">
            <Route index element={<Collection />} />
            <Route path=":id" element={<SingleCollection />} />
          </Route>

          <Route
            path="frequently-asked-questions"
            element={<FAQ />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoute;