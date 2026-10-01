import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Play, Trash2, Star, Film } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import { getImageUrl, calculateMatch } from "../utils/tmdb";
import TrailerModal from "./TrailerModal";

const MyList = ({ Api_Key }) => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredMovies = watchlist.filter((m) => {
    if (filter === "highRated") return (m.vote_average || 0) >= 7.5;
    return true;
  });

  return (
    <div className="netflix-page container-fluid px-4 px-md-5 pt-5 pb-5 text-white" style={{ minHeight: "85vh" }}>
      {/* Header */}
      <div className="pt-4 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom border-dark pb-3">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Bookmark className="text-danger" size={28} />
            <span>My List</span>
          </h2>
          <p className="text-white-50 mb-0 small">
            {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved to watch later
          </p>
        </div>

        {watchlist.length > 0 && (
          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-sm ${filter === "all" ? "btn-light text-dark fw-bold" : "btn-outline-secondary text-white"}`}
              onClick={() => setFilter("all")}
            >
              All Titles ({watchlist.length})
            </button>
            <button
              className={`btn btn-sm ${filter === "highRated" ? "btn-light text-dark fw-bold" : "btn-outline-secondary text-white"}`}
              onClick={() => setFilter("highRated")}
            >
              High Rated (★ 7.5+)
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {watchlist.length === 0 ? (
        <div className="text-center py-5 my-5">
          <div
            className="d-inline-flex p-4 rounded-circle mb-3"
            style={{ backgroundColor: "rgba(229, 9, 20, 0.1)" }}
          >
            <Film size={48} className="text-danger" />
          </div>
          <h4 className="fw-bold mb-2">You haven&apos;t added any titles to your list yet</h4>
          <p className="text-white-50 mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>
            Explore trending blockbusters, award-winning films, and top-rated movies, and click the &ldquo;+&rdquo; icon to save them here.
          </p>
          <Link to="/" className="btn btn-danger px-4 py-2 fw-bold">
            Browse Popular Movies
          </Link>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-5 text-white-50">
          <p>No titles match the selected filter.</p>
          <button className="btn btn-outline-light btn-sm" onClick={() => setFilter("all")}>
            Show All Saved Movies
          </button>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 g-md-4">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="col">
              <div
                className="netflix-card rounded-2 overflow-hidden position-relative shadow-sm h-100 d-flex flex-column"
                style={{
                  backgroundColor: "#181818",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <div className="position-relative w-100" style={{ height: "260px" }}>
                  <img
                    src={getImageUrl(movie.poster_path, "w500")}
                    alt={movie.title}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/Images/blank.png";
                    }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                    }}
                  >
                    <span className="text-success small fw-bold">
                      {calculateMatch(movie.vote_average)}
                    </span>
                    <span className="text-warning small d-flex align-items-center gap-1">
                      <Star size={11} fill="#ffc107" />
                      {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                  <h6 className="fw-bold mb-2 text-truncate text-white" title={movie.title}>
                    {movie.title}
                  </h6>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top border-dark">
                    <button
                      className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
                      style={{ width: "30px", height: "30px" }}
                      title="Play Trailer"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <Play size={14} fill="#000" />
                    </button>

                    <Link
                      to="/moviedetails"
                      state={{ id: movie.id }}
                      className="btn btn-sm btn-outline-secondary text-white py-0 px-2 small"
                      style={{ fontSize: "11px" }}
                    >
                      Details
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-danger rounded-circle p-1 d-flex align-items-center justify-content-center"
                      style={{ width: "30px", height: "30px" }}
                      title="Remove from My List"
                      onClick={() => removeFromWatchlist(movie.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default MyList;
