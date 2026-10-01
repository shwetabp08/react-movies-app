import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Plus, Check, Info, ThumbsUp, Star } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import { calculateMatch, getImageUrl } from "../utils/tmdb";

const MovieCard = ({ movie, onPlayTrailer, rank }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const posterUrl = getImageUrl(movie.poster_path, "w500");

  return (
    <div className="netflix-card-container position-relative">
      <div
        className="netflix-card rounded-2 overflow-hidden position-relative shadow-sm"
        style={{
          backgroundColor: "#181818",
          transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        onClick={() => navigate("/moviedetails", { state: { id: movie.id } })}
      >
        {/* Top 10 Rank Badge (Optional) */}
        {rank && (
          <div
            className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded fw-black text-white"
            style={{
              backgroundColor: "#E50914",
              fontSize: "12px",
              fontWeight: 900,
              zIndex: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            TOP #{rank}
          </div>
        )}

        {/* Poster Image */}
        <div className="position-relative w-100" style={{ height: "340px" }}>
          <img
            src={posterUrl}
            alt={movie.title || "Movie Poster"}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.currentTarget.src = "/Images/blank.png";
            }}
            loading="lazy"
          />

          {/* Subtle Bottom Gradient */}
          <div
            className="position-absolute bottom-0 start-0 w-100"
            style={{
              height: "70px",
              background: "linear-gradient(to top, rgba(20,20,20,0.95), transparent)",
            }}
          />

          {/* Quick Rating Badge */}
          <div
            className="position-absolute bottom-0 end-0 m-2 px-2 py-0.5 rounded d-flex align-items-center gap-1 text-white small"
            style={{ backgroundColor: "rgba(0,0,0,0.75)", fontSize: "11px" }}
          >
            <Star size={12} className="text-warning" fill="#ffc107" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 text-white">
          <h6
            className="fw-bold mb-1 text-truncate"
            title={movie.title}
            style={{ fontSize: "15px" }}
          >
            {movie.title}
          </h6>

          {/* Netflix Micro Info */}
          <div className="d-flex align-items-center justify-content-between text-white-50 small mt-1">
            <span className="text-success fw-bold" style={{ fontSize: "12px" }}>
              {calculateMatch(movie.vote_average)}
            </span>
            <span style={{ fontSize: "12px" }}>
              {movie.release_date ? new Date(movie.release_date).getFullYear() : ""}
            </span>
            <span
              className="badge border border-secondary text-secondary px-1.5 py-0"
              style={{ fontSize: "10px" }}
            >
              HD
            </span>
          </div>

          {/* Quick Action Bar on Hover or Default */}
          <div
            className="d-flex align-items-center justify-content-between pt-3 mt-2 border-top border-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-light rounded-circle p-1 d-flex align-items-center justify-content-center text-dark"
                style={{ width: "32px", height: "32px" }}
                title="Play Trailer"
                onClick={() => onPlayTrailer(movie)}
              >
                <Play size={15} fill="#000" />
              </button>

              <button
                className={`btn rounded-circle p-1 d-flex align-items-center justify-content-center ${
                  inList ? "btn-danger text-white" : "btn-outline-light"
                }`}
                style={{ width: "32px", height: "32px" }}
                title={inList ? "In My List" : "Add to My List"}
                onClick={() => toggleWatchlist(movie)}
              >
                {inList ? <Check size={15} /> : <Plus size={15} />}
              </button>

              <button
                className={`btn rounded-circle p-1 d-flex align-items-center justify-content-center ${
                  liked ? "btn-light text-primary" : "btn-outline-light"
                }`}
                style={{ width: "32px", height: "32px" }}
                title={liked ? "Liked" : "Like"}
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp size={14} />
              </button>
            </div>

            <Link
              to="/moviedetails"
              state={{ id: movie.id }}
              className="btn btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center text-white"
              style={{ width: "32px", height: "32px" }}
              title="More info"
              onClick={(e) => e.stopPropagation()}
            >
              <Info size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
