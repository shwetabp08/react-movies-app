import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, X, Film } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";

const Navbar = ({ onSearch, searchTerm, setSearchTerm }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(1);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (location.pathname === "/search") {
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed-top transition-all ${
        isScrolled ? "netflix-navbar-scrolled" : "netflix-navbar-transparent"
      }`}
      style={{
        transition: "background-color 0.4s ease, padding 0.3s ease",
        zIndex: 1040,
      }}
    >
      <nav className="navbar navbar-expand-lg py-2 py-md-3 px-3 px-md-5">
        <div className="container-fluid px-0">
          {/* Brand Wordmark */}
          <NavLink
            to="/"
            className="navbar-brand text-decoration-none me-4 d-flex align-items-center gap-2"
          >
            <span
              className="brand-logo text-danger fw-black"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                fontSize: "2rem",
                letterSpacing: "2.5px",
                color: "#E50914",
                textShadow: "0 2px 10px rgba(229, 9, 20, 0.4)",
              }}
            >
              CINESTREAM
            </span>
          </NavLink>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler border-0 p-1 text-white shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavContent"
            aria-controls="mainNavContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ filter: "invert(1)" }}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="mainNavContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 gap-lg-3">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `nav-link px-2 fw-medium ${
                      isActive ? "text-white fw-bold active-nav" : "text-white-50"
                    }`
                  }
                  style={{ fontSize: "14px" }}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/top"
                  className={({ isActive }) =>
                    `nav-link px-2 fw-medium ${
                      isActive ? "text-white fw-bold active-nav" : "text-white-50"
                    }`
                  }
                  style={{ fontSize: "14px" }}
                >
                  Top Rated
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/upcomming"
                  className={({ isActive }) =>
                    `nav-link px-2 fw-medium ${
                      isActive ? "text-white fw-bold active-nav" : "text-white-50"
                    }`
                  }
                  style={{ fontSize: "14px" }}
                >
                  Upcoming
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/mylist"
                  className={({ isActive }) =>
                    `nav-link px-2 fw-medium d-flex align-items-center gap-1.5 ${
                      isActive ? "text-white fw-bold active-nav" : "text-white-50"
                    }`
                  }
                  style={{ fontSize: "14px" }}
                >
                  <span>My List</span>
                  {watchlist.length > 0 && (
                    <span
                      className="badge rounded-pill text-white"
                      style={{ backgroundColor: "#E50914", fontSize: "10px" }}
                    >
                      {watchlist.length}
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>

            {/* Right Side Icons: Search, Notifications, Avatar */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {/* Expandable Netflix Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="d-flex align-items-center position-relative"
              >
                <div
                  className={`netflix-search-box d-flex align-items-center rounded ${
                    isSearchOpen || searchTerm ? "open" : ""
                  }`}
                  style={{
                    backgroundColor: isSearchOpen || searchTerm ? "rgba(0,0,0,0.8)" : "transparent",
                    border: isSearchOpen || searchTerm ? "1px solid rgba(255,255,255,0.7)" : "1px solid transparent",
                    padding: "4px 8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <button
                    type="button"
                    className="btn p-0 text-white d-flex align-items-center border-0 shadow-none"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                  >
                    <Search size={18} />
                  </button>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchSubmit(e);
                    }}
                    placeholder="Titles, people, genres..."
                    className="bg-transparent border-0 text-white px-2 small shadow-none"
                    style={{
                      outline: "none",
                      width: isSearchOpen || searchTerm ? "210px" : "0px",
                      opacity: isSearchOpen || searchTerm ? 1 : 0,
                      transition: "width 0.3s ease, opacity 0.2s ease",
                      fontSize: "13px",
                    }}
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="btn p-0 text-white-50 border-0 shadow-none me-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>

              {/* Notification Bell */}
              <div className="position-relative">
                <button
                  className="btn p-1 text-white border-0 shadow-none position-relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                >
                  <Bell size={19} />
                  <span
                    className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                    style={{ width: "8px", height: "8px" }}
                  />
                </button>

                {showNotifications && (
                  <div
                    className="position-absolute end-0 mt-2 p-3 rounded shadow-lg text-white"
                    style={{
                      width: "280px",
                      backgroundColor: "#181818",
                      border: "1px solid rgba(255,255,255,0.15)",
                      zIndex: 1050,
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom border-dark">
                      <span className="fw-bold small">Notifications</span>
                      <span className="text-white-50" style={{ fontSize: "11px" }}>New</span>
                    </div>
                    <div className="small text-white-50 d-flex gap-2 align-items-start mb-2">
                      <Film size={16} className="text-danger flex-shrink-0 mt-1" />
                      <div>
                        <p className="mb-0 text-white fw-semibold">New Blockbusters Added</p>
                        <p className="mb-0" style={{ fontSize: "11px" }}>
                          Explore the latest trending movies and top-rated hits now streaming.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar */}
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{
                    width: "32px",
                    height: "32px",
                    fontSize: "13px",
                    background: "linear-gradient(135deg, #e50914 0%, #831010 100%)",
                    cursor: "pointer",
                  }}
                  title="My Profile"
                >
                  C
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
