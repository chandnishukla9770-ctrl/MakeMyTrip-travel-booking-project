import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Booking() {
    const { id } = useParams();

    const [packageData, setPackageData] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [people, setPeople] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [date, setDate] = useState("");

    // Get selected package
    useEffect(() => {
        axios
            .get(`/api/packages/${id}/`)
            .then((response) => {
                setPackageData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const bookPackage = () => {
        axios
            .post(
                "/api/bookings/",
                {
                    travel_package: id,
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    number_of_people: people,
                    travel_date: date,
                    total_price: packageData.price * people,
                },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRFToken": localStorage.getItem("csrfToken"),
                    },
                }
            )
            .then(() => {
                alert("Booking successful!");
            })
            .catch((error) => {
                console.log("BOOKING ERROR:", error.response?.data);
                alert(JSON.stringify(error.response?.data));
            });
    };

    return (
        <div>
            <h2>Book Your Trip</h2>

            {packageData && (
                <div>
                    <h3>{packageData.name}</h3>
                    <p>{packageData.description}</p>
                    <p>Duration: {packageData.duration}</p>
                    <p>Price: ₹{packageData.price}</p>
                    <p> Total Price: ₹{packageData.price * people}</p>
                </div>
            )}

            <input
                placeholder="Customer Name"
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="Phone"
                onChange={(e) => setPhone(e.target.value)}
            />

            <input
                type="number"
                placeholder="Number of People"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
            />

            <input
                type="date"
                onChange={(e) => setDate(e.target.value)}
            />

            <button onClick={bookPackage} disabled={!packageData}>
                Confirm Booking
            </button>
        </div>
    );
}

export default Booking;