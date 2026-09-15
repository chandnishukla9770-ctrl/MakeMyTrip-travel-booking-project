import { useEffect, useState } from "react";
import { api } from "../api";
import {
    demoDestinations,
    demoHotels,
    demoPackages,
    withDemoRecords,
} from "../catalogData";
import {
    FiBriefcase,
    FiCheckCircle,
    FiClock,
    FiCompass,
    FiHome,
    FiPackage,
    FiRefreshCw,
    FiXCircle,
} from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
    const [destinations, setDestinations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [packages, setPackages] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState("All");

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [bookingError, setBookingError] = useState("");
    const [dashboardError, setDashboardError] = useState("");

    const fetchDashboardData = async () => {
        setIsRefreshing(true);
        setDashboardError("");

        try {
            const responses = await Promise.allSettled([
                api.get("/api/destinations/"),
                api.get("/api/hotels/"),
                api.get("/api/packages/"),
                api.get("/api/bookings/admin/"),
            ]);

            const [
                destinationsResponse,
                hotelsResponse,
                packagesResponse,
                bookingsResponse,
            ] = responses;

            // -----------------------------
            // DESTINATIONS
            // -----------------------------
            if (destinationsResponse.status === "fulfilled") {
                setDestinations(
                    withDemoRecords(
                        destinationsResponse.value.data,
                        demoDestinations
                    )
                );
            }

            // -----------------------------
            // HOTELS
            // -----------------------------
            if (hotelsResponse.status === "fulfilled") {
                setHotels(
                    withDemoRecords(
                        hotelsResponse.value.data,
                        demoHotels
                    )
                );
            }

            // -----------------------------
            // PACKAGES
            // -----------------------------
            if (packagesResponse.status === "fulfilled") {
                setPackages(
                    withDemoRecords(
                        packagesResponse.value.data,
                        demoPackages
                    )
                );
            }

            // -----------------------------
            // BOOKINGS
            // -----------------------------
            if (bookingsResponse.status === "fulfilled") {
                const allBookings = bookingsResponse.value.data || [];

                // Latest booking first
                const sortedBookings = [...allBookings].sort(
                    (a, b) => Number(b.id) - Number(a.id)
                );

                setBookings(sortedBookings);
                setBookingError("");
                setLastUpdated(new Date());
            } else {
                const bookingStatus =
                    bookingsResponse.reason?.response?.status;

                if (bookingStatus === 401 || bookingStatus === 403) {
                    setBookings([]);
                    setBookingError(
                        "Please login with an admin account to view booking details."
                    );
                } else if (bookingStatus >= 500) {
                    setDashboardError(
                        "Booking data could not be refreshed. Please try again."
                    );
                }
            }

            // -----------------------------
            // OTHER DASHBOARD ERRORS
            // -----------------------------
            if (
                responses.some(
                    (response) =>
                        response.status === "rejected" &&
                        response.reason?.response?.status >= 500
                )
            ) {
                setDashboardError(
                    "Some dashboard data could not be refreshed. Please try again."
                );
            }
        } catch (error) {
            console.error("Dashboard data error:", error);
            setDashboardError(
                "Unable to refresh dashboard data."
            );
        } finally {
            setIsRefreshing(false);
        }
    };

    // ------------------------------------------------
    // INITIAL LOAD + AUTOMATIC LIVE REFRESH
    // ------------------------------------------------
    useEffect(() => {
        fetchDashboardData();

        // Dashboard automatically checks for
        // new bookings/status changes every 5 seconds.
        const intervalId = setInterval(() => {
            fetchDashboardData();
        }, 5000);

        // Refresh immediately when admin returns
        // to this browser tab.
        const handleFocus = () => {
            fetchDashboardData();
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    // ------------------------------------------------
    // BOOKING COUNTS
    // ------------------------------------------------
    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "Confirmed"
    );

    const pendingBookings = bookings.filter(
        (booking) => booking.status === "Pending"
    );

    const cancelledBookings = bookings.filter(
        (booking) => booking.status === "Cancelled"
    );

    // ------------------------------------------------
    // FILTER BOOKINGS
    // ------------------------------------------------
    const visibleBookings =
        selectedStatus === "All"
            ? bookings
            : bookings.filter(
                (booking) => booking.status === selectedStatus
            );

    // ------------------------------------------------
    // STAT CARDS
    // ------------------------------------------------
    const statCards = [
        [
            "Destinations",
            destinations.length,
            FiCompass,
            "indigo",
        ],
        [
            "Hotels",
            hotels.length,
            FiHome,
            "coral",
        ],
        [
            "Packages",
            packages.length,
            FiPackage,
            "amber",
        ],
        [
            "Total bookings",
            bookings.length,
            FiBriefcase,
            "teal",
        ],
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">

                {/* -------------------------------- */}
                {/* HEADER */}
                {/* -------------------------------- */}
                <header className="admin-header">
                    <div>
                        <p className="eyebrow">ADMIN PANEL</p>

                        <h1>
                            Dashboard <span>👋</span>
                        </h1>

                        <p className="header-subtitle">
                            Manage your destinations, hotels,
                            packages and bookings from one place.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={fetchDashboardData}
                        disabled={isRefreshing}
                    >
                        <FiRefreshCw
                            className={
                                isRefreshing ? "spin" : ""
                            }
                            size={15}
                        />

                        {isRefreshing
                            ? "Refreshing..."
                            : "Refresh data"}
                    </button>
                </header>

                {/* -------------------------------- */}
                {/* DASHBOARD ERROR */}
                {/* -------------------------------- */}
                {dashboardError && (
                    <p
                        className="dashboard-alert"
                        role="alert"
                    >
                        {dashboardError}
                    </p>
                )}

                {/* -------------------------------- */}
                {/* STATISTICS */}
                {/* -------------------------------- */}
                <section className="stats-grid">
                    {statCards.map(
                        ([label, value, Icon, tone]) => (
                            <article
                                className="stat-card"
                                key={label}
                            >
                                <div
                                    className={`stat - icon ${tone} `}
                                >
                                    <Icon size={22} />
                                </div>

                                <p>{label}</p>

                                <div className="stat-row">
                                    <h2>{value}</h2>
                                </div>

                                <small>
                                    Total available
                                </small>
                            </article>
                        )
                    )}
                </section>

                {/* -------------------------------- */}
                {/* BOOKING STATUS */}
                {/* -------------------------------- */}
                <section className="status-grid">

                    <StatusCard
                        icon={FiCheckCircle}
                        tone="confirmed"
                        label="Confirmed bookings"
                        count={confirmedBookings.length}
                        note="Show confirmed"
                        onClick={() =>
                            setSelectedStatus("Confirmed")
                        }
                        active={
                            selectedStatus === "Confirmed"
                        }
                    />

                    <StatusCard
                        icon={FiClock}
                        tone="pending"
                        label="Pending bookings"
                        count={pendingBookings.length}
                        note="Show pending"
                        onClick={() =>
                            setSelectedStatus("Pending")
                        }
                        active={
                            selectedStatus === "Pending"
                        }
                    />

                    <StatusCard
                        icon={FiXCircle}
                        tone="cancelled"
                        label="Cancelled bookings"
                        count={cancelledBookings.length}
                        note="Show cancelled"
                        onClick={() =>
                            setSelectedStatus("Cancelled")
                        }
                        active={
                            selectedStatus === "Cancelled"
                        }
                    />

                </section>

                {/* -------------------------------- */}
                {/* RECENT BOOKINGS */}
                {/* -------------------------------- */}
                <section className="recent-card">

                    <div className="section-heading">

                        <div>
                            <p className="eyebrow">
                                ACTIVITY
                            </p>

                            <h2>
                                Recent bookings
                            </h2>
                        </div>

                        <div className="booking-tools">

                            {lastUpdated && (
                                <span className="simple-label">
                                    Updated{" "}
                                    {lastUpdated.toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }
                                    )}
                                </span>
                            )}

                            <button
                                className={`filter - button ${selectedStatus === "All"
                                    ? "active"
                                    : ""
                                    } `}
                                onClick={() =>
                                    setSelectedStatus("All")
                                }
                            >
                                All
                            </button>

                        </div>
                    </div>

                    {/* -------------------------------- */}
                    {/* EMPTY STATE */}
                    {/* -------------------------------- */}
                    {visibleBookings.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📭
                            </div>

                            <p>
                                {bookingError ||
                                    "No bookings available."}
                            </p>

                            <small>
                                {bookingError
                                    ? "Login with the admin account and refresh the page."
                                    : "Your latest customer bookings will appear here."}
                            </small>

                        </div>

                    ) : (

                        <div className="table-wrap">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Email</th>
                                        <th>People</th>
                                        <th>Travel date</th>
                                        <th>Total price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {visibleBookings
                                        .slice(0, 5)
                                        .map((booking) => (

                                            <tr key={booking.id}>

                                                <td className="customer-cell">
                                                    {booking.customer_name}
                                                </td>

                                                <td>
                                                    {booking.customer_email}
                                                </td>

                                                <td>
                                                    {booking.number_of_people}
                                                </td>

                                                <td>
                                                    {booking.travel_date}
                                                </td>

                                                <td className="price-cell">
                                                    ₹{booking.total_price}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`booking - status ${booking.status?.toLowerCase()
                                                            } `}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>

                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
};

// ==================================================
// STATUS CARD
// ==================================================

const StatusCard = ({
    icon: Icon,
    tone,
    label,
    count,
    note,
    onClick,
    active,
}) => (
    <button
        className={`status - card ${tone} ${active ? "active" : ""
            } `}
        onClick={onClick}
    >
        <Icon size={22} />

        <div>
            <p>{label}</p>

            <h3>{count}</h3>

            <small>{note}</small>
        </div>
    </button>
);

export default AdminDashboard;

