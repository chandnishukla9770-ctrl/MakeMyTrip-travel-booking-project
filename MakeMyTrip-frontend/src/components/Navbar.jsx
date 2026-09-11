import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { FiLogOut, FiMenu, FiShield, FiX } from "react-icons/fi";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutUser = async () => {
        try {
            await api.post("/api/accounts/logout/", {});
        } finally {
            localStorage.removeItem("csrfToken");
            navigate("/login");
        }
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className={isMenuOpen ? "menu-open" : ""}>
            <h2>MakeMyTrip</h2>
            <button type="button" className="menu-toggle" onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen}>
                {isMenuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
            </button>
            <div className="nav-menu">
                <Link to="/admin" className="admin-shortcut" title="Open Admin Panel" aria-label="Open Admin Panel" onClick={closeMenu}><FiShield size={17} /> <span>Admin</span></Link>
                <Link to="/" onClick={closeMenu}>Home</Link>
                <Link to="/destinations" onClick={closeMenu}>Destinations</Link>
                <Link to="/hotels" onClick={closeMenu}>Hotels</Link>
                <Link to="/packages" onClick={closeMenu}>Packages</Link>
                <Link to="/account" onClick={closeMenu}>Account</Link>
                <Link to="/my-bookings" onClick={closeMenu}>My Bookings</Link>
                <button type="button" className="logout-button" onClick={logoutUser} title="Logout" aria-label="Logout"><FiLogOut size={16} /> <span>Logout</span></button>
            </div>

        </nav>
    )
}

export default Navbar;