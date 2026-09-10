import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginUser = (event) => {
        event.preventDefault();
        axios
            .post("https://makemytrip-travel-booking-project-production.up.railway.app/api/accounts/login/", {
                username: username,
                password: password,
            }, {
                withCredentials: true,
            }
            )
            .then((response) => {
                localStorage.setItem("csrfToken", response.data.csrfToken);
                navigate("/my-bookings");
            })
            .catch((error) => {
                console.log(error.response?.status);
                console.log(error.response?.data);
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