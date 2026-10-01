import { useEffect, useState } from "react";
import { X, Plus, Check, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchTrailerKey, calculateMatch } from "../utils/tmdb";
import { useWatchlist } from "../context/WatchlistContext";

const TrailerModal = ({ movie, apiKey, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    let isMounted = true;
    if (movie?.id) {
      setLoading(true);
      fetchTrailerKey(movie.id, apiKey).then((key) => {
        if (isMounted) {
          setTrailerKey(key);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [movie, apiKey]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);

  return (
    <div
      className="netflix-modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        zIndex: 1060,
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="netflix-modal-content rounded-3 overflow-hidden text-white shadow-lg position-relative"
        style={{
          width: "100%",
          maxWidth: "860px",
          backgroundColor: "#181818",
          boxShadow: "0 20px 40px rgba(0,0,0,0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center text-white p-2"
          style={{
            backgroundColor: "#181818",
            border: "1px solid rgba(255,255,255,0.2)",
            zIndex: 10,
            width: "38px",
            height: "38px",
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Video Player or Placeholder */}
        <div
          className="position-relative w-100"
          style={{ paddingBottom: "56.25%", backgroundColor: "#000" }}
        >
          {loading ? (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white-50">
              <div className="spinner-border text-danger mb-3" role="status" />
              <span>Loading Cinema Trailer...</span>
            </div>
          ) : trailerKey ? (
            <iframe
              className="position-absolute top-0 start-0 w-100 h-100 border-0"
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
              title={movie.title || "Movie Trailer"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-4"
              style={{
                backgroundImage: movie.backdrop_path
                  ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h5 className="fw-bold mb-2">{movie.title}</h5>
              <p className="text-white-50 mb-3" style={{ maxWidth: "450px" }}>
                Official video stream is not available directly on TMDB for this title, but you can explore details and reviews.
              </p>
              <button
                className="btn btn-danger px-4 py-2 fw-bold"
                onClick={() => {
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      (movie.title || "") + " official trailer"
                    )}`,
                    "_blank"
                  );
                }}
              >
                Search Trailer on YouTube
              </button>
            </div>
          )}
        </div>

        {/* Movie Info Section */}
        <div className="p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div>
              <h3 className="fw-bold mb-1">{movie.title}</h3>
              <div className="d-flex align-items-center gap-3 text-white-50 small flex-wrap">
                <span className="text-success fw-bold">
                  {calculateMatch(movie.vote_average)}
                </span>
                <span>
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "N/A"}
                </span>
                <span className="badge bg-secondary bg-opacity-50 text-white px-2 py-1">
                  HD
                </span>
                <span className="badge border border-secondary text-secondary px-2 py-1">
                  16+
                </span>
                <span className="text-warning fw-semibold">
                  ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center gap-2">
              <button
                className={`btn d-flex align-items-center gap-2 fw-semibold px-3 py-2 ${
                  inList ? "btn-outline-light" : "btn-light text-dark"
                }`}
                onClick={() => toggleWatchlist(movie)}
              >
                {inList ? <Check size={18} /> : <Plus size={18} />}
                <span>{inList ? "In My List" : "Add to My List"}</span>
              </button>
              <button
                className="btn btn-outline-light d-flex align-items-center gap-2 fw-semibold px-3 py-2"
                onClick={() => {
                  onClose();
                  navigate("/moviedetails", { state: { id: movie.id } });
                }}
              >
                <Info size={18} />
                <span>Full Details</span>
              </button>
            </div>
          </div>

          <p className="text-white-50 mb-0" style={{ lineHeight: 1.6 }}>
            {movie.overview || "No overview available for this movie."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
