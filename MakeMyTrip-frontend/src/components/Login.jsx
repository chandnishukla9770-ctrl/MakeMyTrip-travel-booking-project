import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginUser = () => {
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

            <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)} />

            <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} />

            <button onClick={loginUser}>Login</button>


        </div>
    );
}

export default Login;