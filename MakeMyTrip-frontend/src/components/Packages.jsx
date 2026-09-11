import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiMap } from "react-icons/fi";
import { API_BASE_URL } from "../api";
import { demoPackages, withDemoRecords } from "../catalogData";



function Packages() {
    const { id } = useParams();
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/packages/`)
            .then((Response) => {
                const selectedDestinationId = Number(id);
                const packageData = withDemoRecords(Array.isArray(Response.data) ? Response.data : [], demoPackages);
                const filteredPackages = id
                    ? packageData.filter((item) => item.destination === selectedDestinationId)
                    : packageData;
                setPackages(filteredPackages);
            })
            .catch((error) => {
                console.log(error);
                setError("Packages could not be loaded. Please try again.");
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    return (
        <div className="catalog-page">
            <div className="catalog-hero"><div><p className="catalog-eyebrow">STEP 3 · PLAN YOUR JOURNEY</p><h1>Pick a package that fits</h1><p>Everything you need for a smooth, well-planned holiday.</p></div><div className="catalog-hero-icon"><FiMap size={28} /></div></div>
            {isLoading ? <div className="catalog-empty">Loading packages...</div> : error ? <div className="catalog-empty catalog-error">{error}</div> : packages.length === 0 ? <div className="catalog-empty">No packages available for this destination yet.</div> : <div className="catalog-grid package-grid">
                {packages.map((item) => (
                    <article className="travel-card package-card" key={item.id}>
                        <div className="package-number">TRIP PACKAGE</div><h3>{item.name}</h3><p className="card-description">{item.description}</p>
                        <div className="package-meta"><span><FiCalendar size={14} /> {item.duration}</span><strong>₹{item.price}</strong></div>
                        <button className="book-action" onClick={() => navigate(`/booking/${item.id}`)}>Book this package <FiArrowRight size={15} /></button>
                    </article>
                ))}
            </div>}
        </div>
    );
}

export default Packages;