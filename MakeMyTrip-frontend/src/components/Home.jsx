import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiCompass, FiMapPin, FiSearch, FiStar } from "react-icons/fi";


function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const searchDestinations = (event) => {
        event.preventDefault();
        navigate(`/destinations${searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : ""}`);
    };

    return (
        <section className="home-page-content">
            <div className="home-hero">
                <div className="home-copy">
                    <div className="home-chip-row" aria-label="Popular travel styles">
                        <span className="home-chip active"><FiCompass /> Curated escapes</span>
                        <span className="home-chip">Beach days</span>
                        <span className="home-chip">City breaks</span>
                    </div>

                    <h1>Explore the World with Makemytrip.</h1>
                    <p className="home-subtitle">Book hotels, travel packages and amazing destinations.</p>

                    <form className="home-search" onSubmit={searchDestinations} role="search">
                        <FiSearch size={18} />
                        <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Where do you want to go?" aria-label="Search destinations" />
                        <button type="submit">Search</button>
                    </form>

                    <div className="home-actions">
                        <Link className="home-primary-action" to="/destinations">
                            Explore Now <FiArrowUpRight />
                        </Link>
                        <Link className="home-secondary-action" to="/packages">View packages</Link>
                    </div>

                    <div className="home-trust-row">
                        <div className="traveler-avatars" aria-hidden="true">
                            <span>R</span><span>A</span><span>N</span>
                        </div>
                        <p><strong>4.9/5</strong> from happy travellers</p>
                    </div>
                </div>

                <div className="home-visual" aria-label="Featured travel destinations">
                    <span className="home-sticker">Wander<br />more</span>
                    <div className="home-photo-main">
                        <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=85" alt="A scenic mountain lake" />
                        <div className="home-photo-caption">
                            <span><FiMapPin /> Himachal Pradesh</span>
                            <strong>Mountain mornings</strong>
                        </div>
                    </div>
                    <div className="home-mini-card">
                        <FiStar />
                        <div><strong>Handpicked</strong><span>stays & experiences</span></div>
                    </div>
                </div>
            </div>

            <div className="home-feature-grid">
                <article className="home-feature-card feature-coral">
                    <span className="feature-number">01</span>
                    <h2>Find your kind of beautiful.</h2>
                    <p>From quiet coastlines to lively city lights, your next mood is waiting.</p>
                </article>
                <article className="home-feature-card feature-blue">
                    <span className="feature-number">02</span>
                    <h2>Plans that feel effortless.</h2>
                    <p>Compare stays, packages and destinations in one simple place.</p>
                </article>
                <article className="home-feature-card feature-cream">
                    <span className="feature-number">03</span>
                    <h2>Memories worth the detour.</h2>
                    <p>Go further with recommendations made for curious travellers.</p>
                </article>
            </div>
        </section>
    )
}

export default Home;