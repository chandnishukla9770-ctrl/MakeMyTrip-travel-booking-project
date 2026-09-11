import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../api";
import { FiArrowRight, FiMail, FiShield } from "react-icons/fi";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const loginUser = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");
        api
            .post("/api/accounts/login/", {
                email: email,
                username: email,
                password: password,
            })
            .then((response) => {
                const csrfToken = response.data.csrfToken || response.data.csrf_token;
                if (csrfToken) {
                    localStorage.setItem("csrfToken", csrfToken);
                }
                navigate("/my-bookings");
            })
            .catch((error) => {
                setErrorMessage(getErrorMessage(error, "Login failed. Please check your credentials."));
            })
            .finally(() => setIsSubmitting(false));
    };

    const continueWithEmail = () => {
        setErrorMessage("");
        document.getElementById("login-identifier")?.focus();
    };

    return (
        <section className="auth-layout">
            <div className="auth-intro">
                <span className="auth-badge"><FiShield /> Secure travel account</span>
                <p className="auth-kicker">WELCOME BACK</p>
                <h1>Your next journey starts here.</h1>
                <p>Sign in to manage bookings, save favourite stays and pick up where you left off.</p>
            </div>
            <div className="auth-card">
                <p className="auth-kicker">ACCOUNT ACCESS</p>
                <h2>Login</h2>
                <p className="auth-muted">Use your MakeMyTrip account to continue.</p>

                <button type="button" className="portal-button" onClick={continueWithEmail}>
                    <FiMail /> Continue with email
                </button>
                <div className="auth-divider"><span>use account credentials</span></div>

                <form onSubmit={loginUser}>
                    <label htmlFor="login-identifier">Username or registered email</label>
                    <input
                        type="text"
                        name="email"
                        id="login-identifier"
                        autoComplete="username"
                        placeholder="Enter username or email"
                        required
                        onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        required
                        onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Login"} <FiArrowRight />
                    </button>
                </form>

                {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
                <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
                <p className="auth-note"><FiMail /> We never share your email with third parties.</p>
            </div>
        </section>
    );
}

export default Login;