import { useEffect, useState } from "react";
import axios from "axios";
import { Award, Star, Filter } from "lucide-react";
import MovieCard from "./MovieCard";
import TrailerModal from "./TrailerModal";

const TopRated = ({ Api_Key }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    setLoading(true);
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${Api_Key}&language=en-US&page=${currentPage}`;
    axios
      .get(url)
      .then((res) => {
        setMovies(res.data.results || []);
        setTotalPages(Math.min(res.data.total_pages || 1, 500));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching top rated movies:", error);
        setLoading(false);
      });
  }, [currentPage, Api_Key]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredMovies = movies.filter(
    (m) => (m.vote_average || 0) >= minRating
  );

  return (
    <div className="netflix-page container-fluid px-4 px-md-5 pt-5 pb-5 text-white" style={{ minHeight: "85vh" }}>
      {/* Top Banner Header */}
      <div className="pt-4 mb-4 pb-3 border-bottom border-dark d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span
              className="badge px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#E50914", fontSize: "11px", letterSpacing: "1px" }}
            >
              HALL OF FAME
            </span>
            <span className="text-warning small d-flex align-items-center gap-1 fw-bold">
              <Star size={13} fill="#ffc107" />
              Critically Acclaimed Cinema
            </span>
          </div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Award className="text-danger" size={30} />
            <span>Top Rated Movies</span>
          </h2>
          <p className="text-white-50 mb-0 small">
            The highest-rated cinematic masterpieces voted by film buffs worldwide.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="text-white-50 small d-flex align-items-center gap-1 me-1">
            <Filter size={14} /> Filter:
          </span>
          <button
            className={`btn btn-sm ${
              minRating === 0
                ? "btn-light text-dark fw-bold"
                : "btn-outline-secondary text-white"
            }`}
            onClick={() => setMinRating(0)}
          >
            All Ratings
          </button>
          <button
            className={`btn btn-sm ${
              minRating === 8.0
                ? "btn-light text-dark fw-bold"
                : "btn-outline-secondary text-white"
            }`}
            onClick={() => setMinRating(8.0)}
          >
            ★ 8.0+ Masterpieces
          </button>
          <button
            className={`btn btn-sm ${
              minRating === 8.5
                ? "btn-light text-dark fw-bold"
                : "btn-outline-secondary text-white"
            }`}
            onClick={() => setMinRating(8.5)}
          >
            ★ 8.5+ Legendary
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status" />
          <p className="mt-3 text-white-50">Loading top rated movies...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-5 text-white-50">
          <p>No movies meet the selected rating filter on this page.</p>
          <button className="btn btn-outline-light btn-sm" onClick={() => setMinRating(0)}>
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 g-md-4">
          {filteredMovies.map((movie, index) => (
            <div key={movie.id} className="col">
              <MovieCard
                movie={movie}
                onPlayTrailer={(m) => setSelectedMovie(m)}
                rank={currentPage === 1 && index < 10 ? index + 1 : undefined}
              />
            </div>
          ))}
        </div>
      )}

      {/* Netflix Pagination */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-5 pt-4 border-top border-dark">
        <button
          className="btn btn-outline-light btn-sm px-3 fw-semibold"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo; Previous
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum = currentPage - 2 + i;
          if (currentPage <= 2) pageNum = i + 1;
          if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
          if (pageNum < 1 || pageNum > totalPages) return null;

          return (
            <button
              key={pageNum}
              className={`btn btn-sm px-3 fw-bold ${
                currentPage === pageNum
                  ? "btn-danger text-white shadow"
                  : "btn-outline-secondary text-white-50"
              }`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="btn btn-outline-light btn-sm px-3 fw-semibold"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next &raquo;
        </button>
      </div>

      {/* Trailer Modal */}
      {selectedMovie && (
        <TrailerModal
          movie={selectedMovie}
          apiKey={Api_Key}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default TopRated;
