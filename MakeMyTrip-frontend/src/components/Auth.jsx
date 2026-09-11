import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../api";
import { FiArrowRight, FiMail, FiShield } from "react-icons/fi";

function Auth() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mode, setMode] = useState(location.pathname === "/login" ? "login" : "register");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setErrorMessage("");
        navigate("/account", { replace: true });
    };

    const submit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");
        try {
            if (mode === "register") {
                await api.post("/api/accounts/register/", { username, email, password });
                setMode("login");
                setErrorMessage("Account created. Login with your new credentials.");
            } else {
                const response = await api.post("/api/accounts/login/", {
                    email,
                    username: email,
                    password,
                });
                const csrfToken = response.data.csrfToken || response.data.csrf_token;
                if (csrfToken) localStorage.setItem("csrfToken", csrfToken);
                navigate("/my-bookings");
            }
        } catch (error) {
            setErrorMessage(getErrorMessage(error, `${mode === "login" ? "Login" : "Registration"} failed.`));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="auth-layout">
            <div className="auth-intro">
                <span className="auth-badge"><FiShield /> Secure travel account</span>
                <p className="auth-kicker">YOUR TRAVEL ACCOUNT</p>
                <h1>One account for every adventure.</h1>
                <p>Save your plans, manage bookings and keep every journey in one place.</p>
            </div>
            <div className="auth-card">
                <p className="auth-kicker">MAKEMYTRIP ACCOUNT</p>
                <div className="auth-tabs" role="tablist" aria-label="Account access">
                    <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Login</button>
                    <button type="button" className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Register</button>
                </div>
                <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
                <p className="auth-muted">{mode === "login" ? "Use your username or registered email." : "Start planning better trips in less than a minute."}</p>
                <div className="auth-divider"><span>{mode === "login" ? "account credentials" : "your details"}</span></div>

                <form onSubmit={submit}>
                    {mode === "register" && (
                        <>
                            <label htmlFor="account-username">Username</label>
                            <input id="account-username" type="text" autoComplete="username" placeholder="Choose a username" required value={username} onChange={(event) => setUsername(event.target.value)} />
                        </>
                    )}
                    <label htmlFor="account-email">{mode === "login" ? "Username or registered email" : "Email"}</label>
                    <input id="account-email" type={mode === "login" ? "text" : "email"} autoComplete={mode === "login" ? "username" : "email"} placeholder={mode === "login" ? "Enter username or email" : "Enter your email"} required value={email} onChange={(event) => setEmail(event.target.value)} />
                    <label htmlFor="account-password">Password</label>
                    <input id="account-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"} <FiArrowRight /></button>
                </form>

                {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
                <p className="auth-switch">{mode === "login" ? "New here? " : "Already have an account? "}<button type="button" className="auth-inline-button" onClick={() => switchMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create an account" : "Login"}</button></p>
                <p className="auth-note"><FiMail /> Your account details stay private.</p>
            </div>
        </section>
    );
}

export default Auth;
