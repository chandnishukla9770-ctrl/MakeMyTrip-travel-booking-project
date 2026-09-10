import { useState } from "react";
import { api, getErrorMessage } from "../api";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const registerUser = (event) => {
        event.preventDefault();
        api
            .post("/api/accounts/register/", {
                username: username,
                email: email,
                password: password,
            })
            .then(() => {
                alert("Registration successful!");
            })
            .catch((error) => {
                console.log("REGISTER ERROR:", error);
                console.log("RESPONSE:", error.response?.data);
                alert(getErrorMessage(error, "Registration failed."));
            });
    };

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={registerUser}>
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

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;