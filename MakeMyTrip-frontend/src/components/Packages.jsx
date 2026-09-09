import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



function Packages() {
    const { id } = useParams();
    const [packages, setPackages] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://makemytrip-travel-booking-project-production.up.railway.app/api/packages/")
            .then((Response) => {
                setPackages(Response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    return (
        <div>
            <h2>Travel Packages</h2>

            {packages.map((item) => (
                <div className="card" key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>Duration : {item.duration}</p>
                    <p>Price :  ₹{item.price}</p>

                    <button onClick={() => navigate(`/booking/${item.id}`)}>
                        Book Now
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Packages;