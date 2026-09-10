import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api";

function MyBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        api
            .get("/api/bookings/")
            .then((response) => {
                console.log("MY BOOKINGS:", response.data);
                setBookings(response.data);
            })
            .catch((error) => {
                console.log("BOOKINGS ERROR:", error);
            });
    }, []);

    const cancelBooking = (id) => {
        api
            .post(`/api/bookings/${id}/cancel/`)
            .then(() => {
                alert("Booking cancelled successfully");

                setBookings(
                    bookings.map((booking) =>
                        booking.id === id
                            ? { ...booking, status: "Cancelled" }
                            : booking
                    )
                );
            })
            .catch((error) => {
                console.log("CANCEL ERROR:", error);
                alert(getErrorMessage(error, "Booking could not be cancelled."));
            });
    };

    return (
        <div>
            <h2>My Bookings</h2>

            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                bookings.map((booking) => (
                    <div key={booking.id}>
                        <h3>{booking.travel_package_name}</h3>

                        <p>
                            Destination: {booking.destination_name}
                        </p>

                        <p>
                            {booking.travel_package_description}
                        </p>

                        <p>
                            Duration: {booking.travel_package_duration}
                        </p>

                        <p>
                            Package Price: ₹{booking.travel_package_price}
                        </p>

                        <p>
                            Customer Name: {booking.customer_name}
                        </p>

                        <p>
                            Number of People: {booking.number_of_people}
                        </p>

                        <p>
                            Travel Date: {booking.travel_date}
                        </p>

                        <p>
                            Total Price: ₹{booking.total_price}
                        </p>

                        <p>
                            Status: {booking.status}
                        </p>

                        {booking.status !== "Cancelled" && (
                            <button
                                onClick={() => cancelBooking(booking.id)}
                            >
                                Cancel Booking
                            </button>
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default MyBookings;

