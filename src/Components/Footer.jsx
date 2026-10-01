import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="netflix-footer py-5 text-white-50 border-top border-dark mt-5">
      <div className="container-fluid px-4 px-md-5">
        <p className="small mb-4">
          Questions? Call{" "}
          <span className="text-white">1-800-012-3456</span> &bull; Available 24/7
        </p>

        <div className="row g-3 small mb-4">
          <div className="col-6 col-md-3">
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/" className="text-white-50 text-decoration-none">
                  FAQ &bull; Help Center
                </Link>
              </li>
              <li>
                <Link to="/top" className="text-white-50 text-decoration-none">
                  Top Rated Hits
                </Link>
              </li>
              <li>
                <Link to="/mylist" className="text-white-50 text-decoration-none">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/upcomming" className="text-white-50 text-decoration-none">
                  Upcoming Releases
                </Link>
              </li>
              <li>
                <span className="text-white-50">Investor Relations</span>
              </li>
              <li>
                <span className="text-white-50">Terms of Use</span>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <span className="text-white-50">Privacy &amp; Cookies</span>
              </li>
              <li>
                <span className="text-white-50">Corporate Information</span>
              </li>
              <li>
                <span className="text-white-50">Media Center</span>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <span className="text-white-50">Audio Description</span>
              </li>
              <li>
                <span className="text-white-50">Original Features</span>
              </li>
              <li>
                <span className="text-white-50">Contact Us</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Language selector button */}
        <div className="mb-4">
          <button className="btn btn-outline-secondary btn-sm text-white-50 d-inline-flex align-items-center gap-2 px-3 py-1.5">
            <Globe size={15} />
            <span>English</span>
          </button>
        </div>

        <p className="text-white-50 small mb-0" style={{ fontSize: "11px" }}>
          Cinema streaming catalog experience powered by TMDB API. All posters and backdrop metadata are copyright of their respective owners.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
