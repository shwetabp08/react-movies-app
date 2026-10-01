import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./App.css";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import TopRated from "./Components/TopRated";
import UpcomingMovies from "./Components/UpcomingMovies";
import MovieDetails from "./Components/MovieDetails";
import SearchedMovie from "./Components/SearchedMovie";
import MyList from "./Components/MyList";
import Footer from "./Components/Footer";
import { WatchlistProvider } from "./context/WatchlistContext";

function App() {
  const Api_key =
    import.meta.env.VITE_TMDB_API_KEY || "c45a857c193f6302f2b5061c3b85e743";

  const [movie, setMovie] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const handleSearch = (page = 1) => {
    const movie_name = movie.trim();
    if (movie_name) {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${Api_key}&language=en-US&query=${encodeURIComponent(
        movie_name
      )}&page=${page}`;

      axios
        .get(url)
        .then((res) => {
          setSearchData(res.data.results || []);
          setTotalPages(res.data.total_pages || 1);
          setCurrentPage(page);
          navigate("/search");
        })
        .catch((error) => console.error("Error fetching movie data:", error));
    }
  };

  return (
    <WatchlistProvider>
      <div className="netflix-app min-vh-100 d-flex flex-column" style={{ backgroundColor: "#141414" }}>
        {/* Netflix Fixed Glass Navbar */}
        <Navbar
          onSearch={handleSearch}
          searchTerm={movie}
          setSearchTerm={setMovie}
        />

        {/* Main Content Area */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home Api_Key={Api_key} />} />
            <Route path="/top" element={<TopRated Api_Key={Api_key} />} />
            <Route
              path="/upcomming"
              element={<UpcomingMovies Api_Key={Api_key} />}
            />
            <Route
              path="/search"
              element={
                <SearchedMovie
                  data={searchData}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handleSearch={handleSearch}
                  searchTerm={movie}
                  apiKey={Api_key}
                />
              }
            />
            <Route
              path="/moviedetails"
              element={<MovieDetails Api_Key={Api_key} />}
            />
            <Route path="/mylist" element={<MyList Api_Key={Api_key} />} />
          </Routes>
        </main>

        {/* Netflix Footer */}
        <Footer />
      </div>
    </WatchlistProvider>
  );
}

export default App;
