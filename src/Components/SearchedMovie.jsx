import { useState } from "react";
import { Search, Film } from "lucide-react";
import MovieCard from "./MovieCard";
import TrailerModal from "./TrailerModal";

const SearchedMovie = ({
  data = [],
  currentPage,
  totalPages,
  handleSearch,
  searchTerm,
  apiKey,
}) => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="netflix-page container-fluid px-4 px-md-5 pt-5 pb-5 text-white"
      style={{ minHeight: "85vh" }}
    >
      {/* Header */}
      <div className="pt-4 mb-4 pb-3 border-bottom border-dark d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span
              className="badge px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#E50914", fontSize: "11px", letterSpacing: "1px" }}
            >
              SEARCH CATALOG
            </span>
            <span className="text-white-50 small">Global Catalog Query</span>
          </div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Search className="text-danger" size={28} />
            <span>Search Results {searchTerm ? `for "${searchTerm}"` : ""}</span>
          </h2>
          <p className="text-white-50 mb-0 small">
            {data.length > 0
              ? `Found titles matching your search query`
              : `No titles found`}
          </p>
        </div>

        {totalPages > 1 && (
          <span className="text-white-50 small">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Grid or Empty State */}
      {data.length > 0 ? (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 g-md-4">
          {data.map((movie) => (
            <div key={movie.id} className="col">
              <MovieCard
                movie={movie}
                onPlayTrailer={(m) => setSelectedMovie(m)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 my-5">
          <div
            className="d-inline-flex p-4 rounded-circle mb-3"
            style={{ backgroundColor: "rgba(229, 9, 20, 0.1)" }}
          >
            <Film size={44} className="text-danger" />
          </div>
          <h4 className="fw-bold mb-2">No matching movies found</h4>
          <p className="text-white-50 mb-4" style={{ maxWidth: "450px", margin: "0 auto" }}>
            Your search for &ldquo;{searchTerm || "this title"}&rdquo; did not have any matches. Try searching for a different movie title, director, or actor.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-5 pt-4 border-top border-dark">
          <button
            className="btn btn-outline-light btn-sm px-3 fw-semibold"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
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
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="btn btn-outline-light btn-sm px-3 fw-semibold"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next &raquo;
          </button>
        </div>
      )}

      {/* Trailer Modal */}
      {selectedMovie && (
        <TrailerModal
          movie={selectedMovie}
          apiKey={apiKey}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default SearchedMovie;
