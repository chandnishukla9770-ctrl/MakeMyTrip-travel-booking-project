import { NavLink, Link } from "react-router-dom";
import { FiBarChart2, FiCompass, FiCreditCard, FiHome, FiLogOut, FiMap, FiPackage, FiUsers } from "react-icons/fi";

const AdminSidebar = () => {
    const links = [
        { label: "Dashboard", icon: FiBarChart2, to: "/admin", end: true },
        { label: "Destinations", icon: FiCompass, to: "/destinations" },
        { label: "Hotels", icon: FiHome, to: "/hotels" },
        { label: "Packages", icon: FiPackage, to: "/packages" },
        { label: "Bookings", icon: FiMap, to: "/my-bookings" },
        { label: "Payments", icon: FiCreditCard, to: "/admin" },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-brand"><span className="brand-mark">M</span><span>MakeMyTrip</span></div>
            <p className="admin-kicker">ADMIN CONSOLE</p>
            <div className="sidebar-divider" />
            <nav className="admin-nav" aria-label="Admin navigation">
                {links.map(({ label, icon: Icon, to, end }) => (
                    <NavLink key={label} to={to} end={end} className="admin-nav-link">
                        <Icon size={18} /><span>{label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-bottom">
                <div className="sidebar-divider" />
                <Link to="/" className="admin-nav-link"><FiLogOut size={18} /><span>Back to website</span></Link>
                <div className="admin-profile"><span className="profile-avatar"><FiUsers size={16} /></span><span><strong>Admin User</strong><small>Super admin</small></span></div>
            </div>
        </aside>
    );
};

export default AdminSidebar;

