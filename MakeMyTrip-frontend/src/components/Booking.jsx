import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getErrorMessage } from "../api";

function Booking() {
    const { id } = useParams();

    const [packageData, setPackageData] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [people, setPeople] = useState(1);
    const [date, setDate] = useState("");

    // Get selected package
    useEffect(() => {
        api
            .get("/api/packages/")
            .then((response) => {
                const selectedPackage = response.data.find(
                    (item) => item.id === Number(id)
                );

                console.log("SELECTED PACKAGE:", selectedPackage);

                setPackageData(selectedPackage);
            })
            .catch((error) => {
                console.log("PACKAGE ERROR:", error);
            });
    }, [id]);

    const bookPackage = () => {
        if (!packageData || people < 1 || !date || !name || !email || !phone) {
            alert("Please fill all booking details.");
            return;
        }

        api
            .post(
                "/api/bookings/",
                {
                    travel_package: id,
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    number_of_people: people,
                    travel_date: date,
                    total_price: Number(packageData.price) * Number(people),
                },
            )
            .then(() => {
                alert("Booking successful!");
            })
            .catch((error) => {
                console.log("BOOKING ERROR:", error.response?.data);
                alert(getErrorMessage(error, "Booking failed. Please login again and try."));
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
                min="1"
                onChange={(e) => setPeople(Number(e.target.value))}
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