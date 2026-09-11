import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { API_BASE_URL } from "../api";
import { demoDestinations, withDemoRecords } from "../catalogData";

function getImageUrl(image) {
    if (!image) return "";

    return image
        .replace("http://", "https://");
}

function Destinations() {
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/destinations/`)
            .then((response) => setDestinations(withDemoRecords(Array.isArray(response.data) ? response.data : [], demoDestinations)))
            .catch((error) => {
                console.error("Error fetching destinations:", error);
                setError("Destinations could not be loaded. Please try again.");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const searchTerm = searchParams.get("search")?.toLowerCase().trim() || "";
    const visibleDestinations = searchTerm
        ? destinations.filter((destination) => `${destination.name} ${destination.description}`.toLowerCase().includes(searchTerm))
        : destinations;

    return (
        <div className="catalog-page destinations-page">
            <div className="catalog-hero">
                <div><p className="catalog-eyebrow">STEP 1 · CHOOSE A PLACE</p><h1>Explore popular destinations</h1><p>Find an inspiring place for your next memorable journey.</p></div>
                <div className="catalog-hero-icon"><FiMapPin size={28} /></div>
            </div>

            {isLoading ? <div className="catalog-empty">Loading destinations...</div> : error ? <div className="catalog-empty catalog-error">{error}</div> : visibleDestinations.length === 0 ? <div className="catalog-empty">No destinations match your search.</div> : <div className="destination-container">

                {visibleDestinations.map((destination) => (
                    <div className="destination-card" key={destination.id}>

                        <img
                            src={getImageUrl(destination.image)}
                            alt={destination.name}
                        />

                        <div className="destination-content">

                            <h3>{destination.name}</h3>

                            <p>{destination.description}</p>

                            <Link to={`/packages/${destination.id}`} className="explore-btn">View packages <FiArrowRight size={15} /></Link>

                        </div>

                    </div>
                ))}

            </div>}
        </div>
    );
}

export default Destinations;