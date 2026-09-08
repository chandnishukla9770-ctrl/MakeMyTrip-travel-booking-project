import axios from "axios";
import { useState } from "react";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const registerUser = () => {
        axios
            .post("http://127.0.0.1:8000/api/accounts/register/", {
                username: username,
                email: email,
                password: password,
            },
                {
                    withCredentials: true,
                })
            .then(() => {
                alert("Registration successful!");
            })
            .catch((error) => {
                console.log("REGISTER ERROR:", error);
                console.log("RESPONSE:", error.response?.data);
                alert(JSON.stringify(error.response?.data));
            });
    };

    return (
        <div>
            <h2>Register</h2>

            <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)} />

            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} />

            <button onClick={registerUser}>Register</button>
        </div>
    );
}

export default Register;