import { useState } from "react";
import { Play, Info, Plus, Check, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { calculateMatch } from "../utils/tmdb";

const HeroBanner = ({ movie, onPlayTrailer }) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/Images/blank.png";

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div
      className="netflix-hero position-relative w-100 text-white d-flex align-items-center"
      style={{
        minHeight: "75vh",
        maxHeight: "850px",
        backgroundImage: `url(${backdropUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
      }}
    >
      {/* Cinematic Gradient Overlays */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background:
            "linear-gradient(to right, rgba(20, 20, 20, 0.95) 0%, rgba(20, 20, 20, 0.75) 35%, rgba(20, 20, 20, 0.25) 70%, transparent 100%)",
        }}
      />
      <div
        className="position-absolute bottom-0 start-0 w-100"
        style={{
          height: "220px",
          background:
            "linear-gradient(to top, #141414 15%, rgba(20, 20, 20, 0.8) 50%, transparent 100%)",
        }}
      />
      <div
        className="position-absolute top-0 start-0 w-100"
        style={{
          height: "120px",
          background:
            "linear-gradient(to bottom, rgba(20, 20, 20, 0.7) 0%, transparent 100%)",
        }}
      />

      {/* Hero Content */}
      <div className="container-fluid px-4 px-md-5 position-relative" style={{ zIndex: 5 }}>
        <div style={{ maxWidth: "680px" }} className="pt-5 mt-4">
          {/* Branding Badge */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span
              className="px-2 py-0.5 rounded text-white fw-bold"
              style={{
                backgroundColor: "#E50914",
                fontSize: "11px",
                letterSpacing: "1.5px",
              }}
            >
              FEATURED
            </span>
            <span
              className="text-white-50 text-uppercase fw-bold"
              style={{ fontSize: "12px", letterSpacing: "2.5px" }}
            >
              Cinema Spotlight
            </span>
          </div>

          {/* Title */}
          <h1
            className="fw-bold mb-3 netflix-hero-title"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              lineHeight: 1.1,
              textShadow: "2px 4px 12px rgba(0,0,0,0.8)",
            }}
          >
            {movie.title}
          </h1>

          {/* Metadata Row */}
          <div className="d-flex align-items-center gap-3 mb-3 text-white-50 small flex-wrap">
            <span className="text-success fw-bold" style={{ fontSize: "14px" }}>
              {calculateMatch(movie.vote_average)}
            </span>
            <span className="text-white fw-semibold">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : "2024"}
            </span>
            <span
              className="badge border border-secondary text-white-50 px-2 py-0.5"
              style={{ fontSize: "11px" }}
            >
              16+
            </span>
            <span
              className="badge bg-secondary bg-opacity-50 text-white px-2 py-0.5"
              style={{ fontSize: "11px" }}
            >
              HD
            </span>
            <span className="text-warning fw-semibold">
              ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>

          {/* Overview Synopsis */}
          <p
            className="netflix-hero-overview text-white-50 mb-4"
            style={{
              fontSize: "clamp(14px, 1.2vw, 17px)",
              lineHeight: 1.5,
              textShadow: "1px 2px 4px rgba(0,0,0,0.8)",
              maxWidth: "580px",
            }}
          >
            {truncate(movie.overview, 180)}
          </p>

          {/* Hero Action Buttons */}
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <button
              className="btn btn-light d-flex align-items-center gap-2 px-4 py-2 fw-bold text-dark netflix-btn-play shadow"
              style={{
                borderRadius: "4px",
                fontSize: "16px",
                transition: "all 0.2s ease",
              }}
              onClick={() => onPlayTrailer(movie)}
            >
              <Play size={20} fill="#000" />
              <span>Play</span>
            </button>

            <button
              className="btn d-flex align-items-center gap-2 px-4 py-2 fw-bold text-white netflix-btn-info shadow"
              style={{
                backgroundColor: "rgba(109, 109, 110, 0.7)",
                borderRadius: "4px",
                fontSize: "16px",
                backdropFilter: "blur(4px)",
                border: "none",
                transition: "all 0.2s ease",
              }}
              onClick={() => navigate("/moviedetails", { state: { id: movie.id } })}
            >
              <Info size={20} />
              <span>More Info</span>
            </button>

            <button
              className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{
                width: "42px",
                height: "42px",
                borderColor: "rgba(255,255,255,0.4)",
                backgroundColor: inList ? "#E50914" : "rgba(30,30,30,0.6)",
              }}
              onClick={() => toggleWatchlist(movie)}
              title={inList ? "Remove from My List" : "Add to My List"}
            >
              {inList ? <Check size={18} /> : <Plus size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Right Control: Sound and Maturity Tag */}
      <div
        className="position-absolute end-0 d-flex align-items-center gap-2 pe-4"
        style={{ bottom: "60px", zIndex: 5 }}
      >
        <button
          className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
          style={{
            width: "38px",
            height: "38px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderColor: "rgba(255,255,255,0.4)",
          }}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div
          className="px-3 py-1 fw-bold text-white d-flex align-items-center border-start border-3 border-white"
          style={{
            backgroundColor: "rgba(51, 51, 51, 0.6)",
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          16+
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
