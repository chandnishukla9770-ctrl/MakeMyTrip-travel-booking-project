import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin, FiStar, FiX } from "react-icons/fi";
import { API_BASE_URL } from "../api";
import { demoHotels, withDemoRecords } from "../catalogData";

const fallbackHotelImages = {
  3: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80",
  4: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
  5: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
};

function getImageUrl(image, fallback) {
  if (!image) return fallback;

  return image
    .replace("http://", "https://");
}

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/hotels/`)
      .then((response) => {
        console.log(response.data);
        setHotels(withDemoRecords(Array.isArray(response.data) ? response.data : [], demoHotels));
      })
      .catch((error) => {
        console.log(error);
        setError("Hotels could not be loaded. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <div><p className="catalog-eyebrow">STEP 2 · FIND YOUR STAY</p><h1>Stay somewhere special</h1><p>Compare comfortable hotels and choose the right stay for your trip.</p></div>
        <div className="catalog-hero-icon"><FiMapPin size={28} /></div>
      </div>
      {isLoading ? <div className="catalog-empty">Loading hotels...</div> : error ? <div className="catalog-empty catalog-error">{error}</div> : hotels.length === 0 ? <div className="catalog-empty">No hotels available yet.</div> : <div className="catalog-grid">
        {hotels.map((hotel) => (
          <article className="travel-card" key={hotel.id}>
            <img
              src={getImageUrl(hotel.image, fallbackHotelImages[hotel.id])}
              alt={hotel.name}
              onError={(event) => {
                const fallback = fallbackHotelImages[hotel.id];
                if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
              }}
            />
            <div className="travel-card-body"><div className="card-title-row"><h3>{hotel.name}</h3><span className="rating"><FiStar size={12} /> {hotel.rating}</span></div>
              <p className="card-description">{hotel.description}</p><p className="card-location"><FiMapPin size={14} /> {hotel.location}</p>
              <div className="card-footer"><strong>₹{hotel.price_per_night}<small> / night</small></strong><button className="card-action" onClick={() => setSelectedHotel(hotel)}>View details <FiArrowRight size={14} /></button></div></div>
          </article>
        ))}
      </div>}

      {selectedHotel && (
        <div className="details-modal-backdrop" role="presentation" onClick={() => setSelectedHotel(null)}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="hotel-details-title" onClick={(event) => event.stopPropagation()}>
            <button className="details-modal-close" type="button" aria-label="Close hotel details" onClick={() => setSelectedHotel(null)}><FiX /></button>
            <img src={getImageUrl(selectedHotel.image, fallbackHotelImages[selectedHotel.id])} alt={selectedHotel.name} />
            <div className="details-modal-content">
              <p className="catalog-eyebrow">HOTEL DETAILS</p>
              <h2 id="hotel-details-title">{selectedHotel.name}</h2>
              <p className="details-modal-location"><FiMapPin /> {selectedHotel.location}</p>
              <p className="details-modal-description">{selectedHotel.description}</p>
              <div className="details-modal-stats">
                <span><FiStar /> {selectedHotel.rating} rating</span>
                <strong>₹{selectedHotel.price_per_night}<small> / night</small></strong>
              </div>
              <Link className="details-modal-action" to={`/booking/${selectedHotel.destinations || selectedHotel.id}`} onClick={() => setSelectedHotel(null)}>Plan this stay <FiArrowRight /></Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Hotels;