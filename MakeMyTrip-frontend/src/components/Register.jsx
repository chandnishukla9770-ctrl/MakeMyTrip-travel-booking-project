import { useState } from "react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../api";
import { FiArrowRight, FiMail, FiShield } from "react-icons/fi";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const registerUser = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");
        api
            .post("/api/accounts/register/", {
                username: username,
                email: email,
                password: password,
            })
            .then(() => {
                window.location.assign("/login");
            })
            .catch((error) => {
                setErrorMessage(getErrorMessage(error, "Registration failed."));
            })
            .finally(() => setIsSubmitting(false));
    };

    const continueWithEmail = () => {
        setErrorMessage("");
        document.getElementById("register-email")?.focus();
    };

    return (
        <section className="auth-layout">
            <div className="auth-intro">
                <span className="auth-badge"><FiShield /> Secure travel account</span>
                <p className="auth-kicker">PLAN MORE. WORRY LESS.</p>
                <h1>Make room for more adventures.</h1>
                <p>Create one account for every destination, hotel and package you book with us.</p>
            </div>
            <div className="auth-card">
                <p className="auth-kicker">JOIN MAKEMYTRIP</p>
                <h2>Register</h2>
                <p className="auth-muted">Create your account in less than a minute.</p>

                <button type="button" className="portal-button" onClick={continueWithEmail}>
                    <FiMail /> Sign up with email
                </button>
                <div className="auth-divider"><span>or use email</span></div>

                <form onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)} />

                    <input
                        type="email"
                        id="register-email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)} />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create account"} <FiArrowRight />
                    </button>
                </form>

                {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
                <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
                <p className="auth-note"><FiMail /> Your email is only used for account updates.</p>
            </div>
        </section>
    );
}

export default Register;