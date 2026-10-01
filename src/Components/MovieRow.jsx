import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies = [], onPlayTrailer, showRank = false }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="netflix-row my-4 position-relative px-4 px-md-5">
      {/* Row Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="fw-bold text-white mb-0 netflix-row-title d-flex align-items-center gap-2">
          {title}
          <span className="netflix-explore-all text-danger small fw-semibold" style={{ fontSize: "12px", cursor: "pointer" }}>
            Explore All &rsaquo;
          </span>
        </h4>
      </div>

      {/* Row Container with Slide Buttons */}
      <div className="position-relative group">
        {/* Left Arrow */}
        <button
          className="netflix-slider-btn netflix-slider-left position-absolute start-0 top-0 h-100 d-flex align-items-center justify-content-center text-white border-0"
          style={{
            zIndex: 10,
            width: "48px",
            background: "linear-gradient(to right, rgba(20,20,20,0.95), transparent)",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
          }}
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Scrollable Movie Cards Track */}
        <div
          ref={rowRef}
          className="netflix-row-track d-flex gap-3 overflow-x-auto pb-3 pt-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="netflix-row-item flex-shrink-0"
              style={{
                width: "220px",
                scrollSnapAlign: "start",
              }}
            >
              <MovieCard
                movie={movie}
                onPlayTrailer={onPlayTrailer}
                rank={showRank ? index + 1 : undefined}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="netflix-slider-btn netflix-slider-right position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center text-white border-0"
          style={{
            zIndex: 10,
            width: "48px",
            background: "linear-gradient(to left, rgba(20,20,20,0.95), transparent)",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
          }}
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
