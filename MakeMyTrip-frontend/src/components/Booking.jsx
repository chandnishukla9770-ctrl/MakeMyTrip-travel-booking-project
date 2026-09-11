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

    const startPayment = async (bookingId) => {
        try {
            if (!window.Razorpay) {
                throw new Error("Razorpay Checkout could not be loaded. Please refresh and try again.");
            }

            const response = await api.post(
                "/api/create-payment-order/",
                {
                    booking_id: bookingId,
                }
            );

            const orderData = response.data;

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "MakeMyTrip",
                description: "MakeMyTrip internship demo - test payment",
                order_id: orderData.order_id,

                handler: async function (paymentResponse) {
                    try {
                        const verifyResponse = await api.post(
                            "/api/verify-payment/",
                            {
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                            }
                        );

                        console.log("PAYMENT VERIFIED:", verifyResponse.data);

                        alert("Payment successful! Your booking is confirmed.");

                    } catch (error) {
                        console.log(
                            "PAYMENT VERIFICATION ERROR:",
                            error.response?.data
                        );

                        alert(
                            getErrorMessage(
                                error,
                                "Payment verification failed."
                            )
                        );
                    }
                },

                prefill: {
                    name: name,
                    email: email,
                    contact: phone,
                },

                theme: {
                    color: "#3399cc",
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();

        } catch (error) {
            console.log("PAYMENT ORDER ERROR:", error.response?.data);
            alert(getErrorMessage(error, "Unable to start test payment. Please try again."));
        }
    };

    const bookPackage = async () => {
        if (!packageData || people < 1 || !date || !name || !email || !phone) {
            alert("Please fill all booking details.");
            return;
        }

        try {
            const response = await api.post("/api/bookings/", {
                travel_package: id,
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                number_of_people: people,
                travel_date: date,
                total_price: Number(packageData.price) * Number(people),
            });

            console.log("BOOKING CREATED:", response.data);

            alert("Booking created. Opening payment...");

            await startPayment(response.data.id);

        } catch (error) {
            console.log("BOOKING ERROR:", error.response?.data);

            alert(
                getErrorMessage(
                    error,
                    "Booking failed. Please login again and try."
                )
            );
        }
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

                    <p>
                        Total Price: ₹
                        {Number(packageData.price) * Number(people)}
                    </p>
                </div>
            )}

            <input
                placeholder="Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="Phone"
                value={phone}
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <button onClick={bookPackage} disabled={!packageData}>
                Confirm Booking & Pay (Test Mode)
            </button>
        </div>
    );
}

export default Booking;