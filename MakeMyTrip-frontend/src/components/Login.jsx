import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginUser = (event) => {
        event.preventDefault();
        api
            .post("/api/accounts/login/", {
                username: username,
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
                console.log(error.response?.status);
                console.log(error.response?.data);
                alert(getErrorMessage(error, "Login failed. Please check your credentials."));
            });
    };


    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={loginUser}>
                <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    placeholder="Username"
                    required
                    onChange={(e) => setUsername(e.target.value)} />

                <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)} />

                <button type="submit">Login</button>
            </form>


        </div>
    );
}

export default Login;