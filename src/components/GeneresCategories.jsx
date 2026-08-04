import React from "react";

const GeneresCategories = ({ genres }) => {
  const genreList = genres?.length
    ? genres.map((genre) => (typeof genre === "string" ? genre : genre.name))
    : [];

  return (
    <section className="categories relative">
      <div className="container">
        <h2 className="text-5xl mb-10 font-semibold text-white">Genres</h2>
        <div className="list">
          {genreList.length > 0 && (
            <div className="flex items-center justify-between mb-10 relative z-1">
              <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
                {genreList.map((category, index) => (
                  <button
                    key={index}
                    className="bg-pink-500 border outline-none border-pink-500 text-white py-2 px-4 rounded-full"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeneresCategories;
