import { useEffect, useState } from "react";
import axios from "axios";
import { LayoutGrid, Rows, Flame } from "lucide-react";
import HeroBanner from "./HeroBanner";
import MovieRow from "./MovieRow";
import MovieCard from "./MovieCard";
import TrailerModal from "./TrailerModal";
import { useWatchlist } from "../context/WatchlistContext";

const Home = ({ Api_Key }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("rows"); // 'rows' or 'grid'
  const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const { watchlist } = useWatchlist();

  // Fetch popular movies for the main list & billboard
  useEffect(() => {
    setLoading(true);
    const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${Api_Key}&language=en-US&page=${currentPage}`;
    
    axios
      .get(popularUrl)
      .then((res) => {
        const results = res.data.results || [];
        setPopularMovies(results);
        setTotalPages(Math.min(res.data.total_pages || 1, 500));
        
        // Select a good featured movie with backdrop
        if (results.length > 0) {
          const bannerCandidate = results.find((m) => m.backdrop_path && m.overview) || results[0];
          setFeaturedMovie((prev) => prev || bannerCandidate);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching popular movies:", error);
        setLoading(false);
      });
  }, [currentPage, Api_Key]);

  // Fetch top rated & upcoming for rows
  useEffect(() => {
    const topUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${Api_Key}&language=en-US&page=1`;
    const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${Api_Key}&language=en-US&page=1`;

    axios
      .get(topUrl)
      .then((res) => setTopRatedMovies(res.data.results || []))
      .catch((err) => console.error(err));

    axios
      .get(upcomingUrl)
      .then((res) => setUpcomingMovies(res.data.results || []))
      .catch((err) => console.error(err));
  }, [Api_Key]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  };

  const handlePlayTrailer = (movie) => {
    setSelectedTrailerMovie(movie);
  };

  return (
    <div className="netflix-home pb-5 text-white" style={{ minHeight: "100vh" }}>
      {/* Netflix Cinematic Hero Billboard */}
      {featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      {/* Row / Grid View Toggle Toolbar */}
      <div className="container-fluid px-4 px-md-5 mt-4 mb-2 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <span
            className="badge px-2.5 py-1 text-uppercase fw-bold"
            style={{ backgroundColor: "#E50914", letterSpacing: "1px", fontSize: "11px" }}
          >
            Featured Catalog
          </span>
          <span className="text-white-50 small">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 bg-dark p-1 rounded border border-secondary border-opacity-25">
          <button
            className={`btn btn-sm d-flex align-items-center gap-1.5 ${
              viewMode === "rows" ? "btn-danger fw-bold" : "btn-link text-white-50 text-decoration-none"
            }`}
            onClick={() => setViewMode("rows")}
            style={{ fontSize: "13px" }}
          >
            <Rows size={15} />
            <span>Row View</span>
          </button>
          <button
            className={`btn btn-sm d-flex align-items-center gap-1.5 ${
              viewMode === "grid" ? "btn-danger fw-bold" : "btn-link text-white-50 text-decoration-none"
            }`}
            onClick={() => setViewMode("grid")}
            style={{ fontSize: "13px" }}
          >
            <LayoutGrid size={15} />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Watchlist Row if available */}
      {watchlist.length > 0 && viewMode === "rows" && (
        <MovieRow
          title="Continue Watching &bull; My List"
          movies={watchlist}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      {/* View Mode: Rows */}
      {viewMode === "rows" ? (
        <div className="netflix-rows-section">
          {/* Top 10 Today / Trending Now */}
          <MovieRow
            title="Top 10 Movies Today"
            movies={popularMovies.slice(0, 10)}
            onPlayTrailer={handlePlayTrailer}
            showRank={true}
          />

          {/* Popular Blockbusters */}
          <MovieRow
            title="Trending & Popular Releases"
            movies={popularMovies.slice(10)}
            onPlayTrailer={handlePlayTrailer}
          />

          {/* Top Rated Masterpieces */}
          <MovieRow
            title="Critically Acclaimed & Top Rated"
            movies={topRatedMovies}
            onPlayTrailer={handlePlayTrailer}
          />

          {/* Upcoming Movies */}
          <MovieRow
            title="Worth the Wait &bull; Coming Soon"
            movies={upcomingMovies}
            onPlayTrailer={handlePlayTrailer}
          />
        </div>
      ) : (
        /* View Mode: Grid (Explore All Movies with Pagination) */
        <div className="container-fluid px-4 px-md-5 pt-3">
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <Flame className="text-danger" size={24} />
            <span>All Popular Movies</span>
          </h4>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status" />
              <p className="mt-3 text-white-50">Loading movie titles...</p>
            </div>
          ) : (
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 g-md-4">
              {popularMovies.map((m, idx) => (
                <div key={m.id} className="col">
                  <MovieCard
                    movie={m}
                    onPlayTrailer={handlePlayTrailer}
                    rank={currentPage === 1 && idx < 10 ? idx + 1 : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Netflix Pagination */}
      <div className="container-fluid px-4 px-md-5 mt-5">
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 pt-4 border-top border-dark">
          <button
            className="btn btn-outline-light btn-sm px-3 fw-semibold"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &laquo; Previous
          </button>

          {/* Page numbers around current */}
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
      </div>

      {/* Trailer Modal */}
      {selectedTrailerMovie && (
        <TrailerModal
          movie={selectedTrailerMovie}
          apiKey={Api_Key}
          onClose={() => setSelectedTrailerMovie(null)}
        />
      )}
    </div>
  );
};

export default Home;
