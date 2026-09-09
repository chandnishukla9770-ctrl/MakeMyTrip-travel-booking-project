import { useEffect, useState } from "react";
import axios from "axios";

function Hotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios.get("https://makemytrip-travel-booking-project-production.up.railway.app/api/hotels/")
      .then((response) => {
        console.log(response.data);
        setHotels(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h2>Popular Hotels</h2>

      {hotels.map((hotel) => (
        <div className="card" key={hotel.id}>
          <img
            src={hotel.image?.replace(
              "/destinations/hotels/",
              "/hotels/"
            )}
            alt={hotel.name}
          />
          <h3>{hotel.name}</h3>
          <p>{hotel.description}</p>
          <p>Location: {hotel.location}</p>
          <p>Rating: ⭐ {hotel.rating}</p>
          <p>Price: ₹{hotel.price_per_night}</p>
        </div>
      ))}
    </div>
  );
}

export default Hotels;