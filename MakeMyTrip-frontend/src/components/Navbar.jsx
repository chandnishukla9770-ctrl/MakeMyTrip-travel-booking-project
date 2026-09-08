import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <h2>MakeMyTrip</h2>

            <Link to="/">Home</Link>
            <Link to="/destinations">Destinations</Link>
            <Link to="/hotels">Hotels</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/my-bookings">My Bookings</Link>

        </nav>
    )
}

export default Navbar;