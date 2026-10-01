import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Play,
  Plus,
  Check,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Globe,
  Share2,
} from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import { calculateMatch, getImageUrl, getBackdropUrl } from "../utils/tmdb";
import MovieCard from "./MovieCard";
import TrailerModal from "./TrailerModal";

const MovieDetails = ({ Api_Key }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const movieId = location.state?.movieId || location.state?.id || "Unknown";

  const [movieDetails, setMovieDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const castScrollRef = useRef(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (!movieId || movieId === "Unknown") {
      setLoading(false);
      return;
    }

    setLoading(true);
    window.scrollTo(0, 0);

    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${Api_Key}&language=en-US`;
    const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${Api_Key}&language=en-US`;
    const similarUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${Api_Key}&language=en-US`;

    Promise.all([
      axios.get(movieUrl).catch((err) => {
        console.error("Movie error:", err);
        return { data: {} };
      }),
      axios.get(castUrl).catch((err) => {
        console.error("Cast error:", err);
        return { data: { cast: [] } };
      }),
      axios.get(similarUrl).catch((err) => {
        console.error("Similar error:", err);
        return { data: { results: [] } };
      }),
    ]).then(([movieRes, castRes, similarRes]) => {
      setMovieDetails(movieRes.data || {});
      setCast(castRes.data?.cast || []);
      setSimilarMovies(similarRes.data?.results || []);
      setLoading(false);
    });
  }, [movieId, Api_Key]);

  const handleCastScroll = (direction) => {
    if (castScrollRef.current) {
      const scrollAmount = castScrollRef.current.clientWidth * 0.7;
      castScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? castScrollRef.current.scrollLeft - scrollAmount
            : castScrollRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (movieId === "Unknown" || (!loading && !movieDetails.id)) {
    return (
      <div className="container py-5 text-center text-white" style={{ minHeight: "75vh" }}>
        <div className="pt-5 mt-5">
          <h3 className="fw-bold mb-3">No Movie Selected</h3>
          <p className="text-white-50 mb-4">
            Please pick a title from Home, Top Rated, or Search.
          </p>
          <button className="btn btn-danger px-4 py-2 fw-bold" onClick={() => navigate("/")}>
            Explore Movie Catalog
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center text-white"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-danger mb-3" role="status" />
        <span className="text-white-50">Loading movie details...</span>
      </div>
    );
  }

  const inList = isInWatchlist(movieDetails.id);
  const backdrop = getBackdropUrl(
    movieDetails.backdrop_path || movieDetails.poster_path,
    "original"
  );
  const releaseYear = movieDetails.release_date
    ? new Date(movieDetails.release_date).getFullYear()
    : "N/A";

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return "$" + (amount / 1000000).toFixed(1) + "M";
  };

  return (
    <div className="netflix-details-page text-white pb-5" style={{ minHeight: "100vh" }}>
      {/* Immersive Backdrop Banner */}
      <div
        className="position-relative w-100 d-flex align-items-end"
        style={{
          minHeight: "72vh",
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }}
      >
        {/* Gradients */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,20,20,0.6) 0%, rgba(20,20,20,0.3) 40%, rgba(20,20,20,0.95) 85%, #141414 100%)",
          }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.7) 40%, transparent 100%)",
          }}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn position-absolute top-0 start-0 m-4 m-md-5 rounded-circle d-flex align-items-center justify-content-center text-white border-0"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(5px)",
            width: "44px",
            height: "44px",
            zIndex: 10,
          }}
          title="Go Back"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Banner Content */}
        <div className="container-fluid px-4 px-md-5 position-relative pb-5" style={{ zIndex: 5 }}>
          <div style={{ maxWidth: "780px" }}>
            {/* Feature Badge */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 rounded text-white fw-bold"
                style={{
                  backgroundColor: "#E50914",
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                }}
              >
                FEATURE
              </span>
              <span
                className="text-white-50 text-uppercase fw-bold"
                style={{ fontSize: "11px", letterSpacing: "2px" }}
              >
                FILM &bull; {movieDetails.status || "RELEASED"}
              </span>
            </div>

            <h1
              className="fw-bold mb-2"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                lineHeight: 1.1,
                textShadow: "2px 4px 10px rgba(0,0,0,0.9)",
              }}
            >
              {movieDetails.title}
            </h1>

            {movieDetails.tagline && (
              <p className="text-white-50 fst-italic mb-3" style={{ fontSize: "18px" }}>
                &ldquo;{movieDetails.tagline}&rdquo;
              </p>
            )}

            {/* Quick Metadata */}
            <div className="d-flex align-items-center gap-3 mb-4 text-white-50 small flex-wrap">
              <span className="text-success fw-bold" style={{ fontSize: "15px" }}>
                {calculateMatch(movieDetails.vote_average)}
              </span>
              <span className="text-white fw-semibold">{releaseYear}</span>
              <span className="badge border border-secondary text-white-50 px-2 py-0.5">
                16+
              </span>
              {movieDetails.runtime && (
                <span className="text-white-50 d-flex align-items-center gap-1">
                  <Clock size={14} />
                  {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
                </span>
              )}
              <span className="badge bg-secondary bg-opacity-50 text-white px-2 py-0.5">
                Ultra HD 4K
              </span>
              <span className="text-warning fw-semibold d-flex align-items-center gap-1">
                <Star size={14} fill="#ffc107" />
                {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A"}{" "}
                <span className="text-white-50 small">
                  ({movieDetails.vote_count?.toLocaleString()} votes)
                </span>
              </span>
            </div>

            {/* Main Action Buttons */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <button
                className="btn btn-light d-flex align-items-center gap-2 px-4 py-2 fw-bold text-dark netflix-btn-play shadow"
                style={{ fontSize: "16px" }}
                onClick={() => setSelectedTrailer(movieDetails)}
              >
                <Play size={20} fill="#000" />
                <span>Play Trailer</span>
              </button>

              <button
                className={`btn d-flex align-items-center gap-2 px-4 py-2 fw-bold ${
                  inList ? "btn-outline-danger text-white" : "btn-outline-light"
                }`}
                style={{
                  backgroundColor: inList ? "rgba(229, 9, 20, 0.2)" : "rgba(30,30,30,0.7)",
                  backdropFilter: "blur(4px)",
                }}
                onClick={() => toggleWatchlist(movieDetails)}
              >
                {inList ? <Check size={18} /> : <Plus size={18} />}
                <span>{inList ? "In My List" : "Add to My List"}</span>
              </button>

              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center text-white"
                style={{ width: "42px", height: "42px" }}
                onClick={handleShare}
                title="Share link"
              >
                <Share2 size={18} />
              </button>
              {copied && <span className="text-success small fw-semibold">Link copied!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Details & Metadata Grid */}
      <div className="container-fluid px-4 px-md-5 mt-4">
        <div className="row g-5">
          {/* Left Column: Synopsis & Storyline */}
          <div className="col-lg-8">
            {/* Overview */}
            <div className="mb-5">
              <h4 className="fw-bold mb-3 border-start border-3 border-danger ps-3">
                Storyline
              </h4>
              <p
                className="text-white-50"
                style={{ fontSize: "16px", lineHeight: 1.8, maxWidth: "800px" }}
              >
                {movieDetails.overview || "No overview is currently available for this film."}
              </p>

              {/* Genre Pills */}
              {movieDetails.genres?.length > 0 && (
                <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                  <span className="text-white-50 small fw-semibold me-1">Genres:</span>
                  {movieDetails.genres.map((g) => (
                    <span
                      key={g.id}
                      className="badge px-3 py-1.5 rounded-pill text-white"
                      style={{
                        backgroundColor: "#262626",
                        border: "1px solid rgba(255,255,255,0.1)",
                        fontSize: "12px",
                      }}
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Cast Section */}
            {cast.length > 0 && (
              <div className="mb-5">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="fw-bold mb-0 border-start border-3 border-danger ps-3">
                    Top Billed Cast
                  </h4>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm rounded-circle p-1"
                      onClick={() => handleCastScroll("left")}
                      aria-label="Scroll cast left"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm rounded-circle p-1"
                      onClick={() => handleCastScroll("right")}
                      aria-label="Scroll cast right"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div
                  ref={castScrollRef}
                  className="d-flex gap-3 overflow-x-auto pb-3"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {cast.slice(0, 15).map((person) => (
                    <div
                      key={person.id || person.cast_id}
                      className="flex-shrink-0 text-center"
                      style={{ width: "135px" }}
                    >
                      <div
                        className="rounded-2 overflow-hidden mb-2 shadow-sm"
                        style={{ height: "185px", backgroundColor: "#1f1f1f" }}
                      >
                        <img
                          src={
                            person.profile_path
                              ? getImageUrl(person.profile_path, "w185")
                              : "/Images/blank.png"
                          }
                          alt={person.name}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/Images/blank.png";
                          }}
                        />
                      </div>
                      <h6
                        className="fw-bold mb-0 text-truncate text-white small"
                        title={person.name}
                      >
                        {person.name}
                      </h6>
                      <p
                        className="text-white-50 small mb-0 text-truncate"
                        style={{ fontSize: "11px" }}
                        title={person.character}
                      >
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Key Production Stats */}
          <div className="col-lg-4">
            <div
              className="p-4 rounded-3 text-white"
              style={{
                backgroundColor: "#181818",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h5 className="fw-bold mb-3 text-white pb-2 border-bottom border-dark">
                Production Facts
              </h5>

              <div className="d-flex flex-column gap-3 small">
                <div>
                  <span className="text-white-50 d-block">Original Title:</span>
                  <span className="fw-semibold text-white">
                    {movieDetails.original_title || movieDetails.title}
                  </span>
                </div>

                <div>
                  <span className="text-white-50 d-block">Release Date:</span>
                  <span className="fw-semibold text-white d-flex align-items-center gap-1">
                    <Calendar size={13} className="text-danger" />
                    {movieDetails.release_date || "N/A"}
                  </span>
                </div>

                <div>
                  <span className="text-white-50 d-block">Original Language:</span>
                  <span className="fw-semibold text-white text-uppercase d-flex align-items-center gap-1">
                    <Globe size={13} className="text-danger" />
                    {movieDetails.original_language || "en"}
                  </span>
                </div>

                <div>
                  <span className="text-white-50 d-block">Budget:</span>
                  <span className="fw-semibold text-white">
                    {formatCurrency(movieDetails.budget)}
                  </span>
                </div>

                <div>
                  <span className="text-white-50 d-block">Revenue:</span>
                  <span className="fw-semibold text-white">
                    {formatCurrency(movieDetails.revenue)}
                  </span>
                </div>

                {movieDetails.production_companies?.length > 0 && (
                  <div>
                    <span className="text-white-50 d-block">Studio &amp; Production:</span>
                    <span className="fw-semibold text-white">
                      {movieDetails.production_companies.map((c) => c.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* More Like This / Recommendations Row */}
        {similarMovies.length > 0 && (
          <div className="mt-5 pt-4 border-top border-dark">
            <h4 className="fw-bold mb-4 border-start border-3 border-danger ps-3">
              More Like This
            </h4>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 g-md-4">
              {similarMovies.slice(0, 12).map((sim) => (
                <div key={sim.id} className="col">
                  <MovieCard
                    movie={sim}
                    onPlayTrailer={(m) => setSelectedTrailer(m)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <TrailerModal
          movie={selectedTrailer}
          apiKey={Api_Key}
          onClose={() => setSelectedTrailer(null)}
        />
      )}
    </div>
  );
};

export default MovieDetails;
