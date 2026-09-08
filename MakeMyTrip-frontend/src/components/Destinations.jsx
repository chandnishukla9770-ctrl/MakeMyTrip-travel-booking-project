import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Link } from "react-router-dom";

function Destinations() {
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        axios
            .get("/api/destinations/")
            .then((response) => setDestinations(response.data))
            .catch((error) => {
                console.error("Error fetching destinations:", error);
            });
    }, []);

    return (
        <div className="destinations">
            <h2>Popular Destinations</h2>

            <div className="destination-container">

                {destinations.map((destination) => (
                    <div className="destination-card" key={destination.id}>

                        <img
                            src={destination.image?.replace(
                                "/destinations/destinations/",
                                "/destinations/"
                            )}
                            alt={destination.name}
                        />

                        <div className="destination-content">

                            <h3>{destination.name}</h3>

                            <p>{destination.description}</p>

                            <Link to={`/packages/${destination.id}`} className="explore-btn">Explore Now</Link>

                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}

export default Destinations;