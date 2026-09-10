import { Link } from "react-router-dom";


function Home() {
    return (
        <>
            <h1>Explore the World with Makemytrip.</h1>
            <p>Book hotels, travel packages and amazing destinations.</p>


            <Link to="/destinations"
                style={{
                    display: "block",
                    width: "100%",
                    padding: "15px",
                    backgroundColor: "red",
                    color: "white",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: "5px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    boxSizing: "border-box",
                }}>Explore Now</Link>

        </>
    )
}

export default Home;