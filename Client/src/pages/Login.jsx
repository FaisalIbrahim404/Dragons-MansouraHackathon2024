import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import Cookies from "js-cookie";
import useUser from "../store/useUser";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const setUser = useUser((state) => state.setUser);

    const handleLogin = () => {
        // Simulate login and token validation
        const token = "dummy-token";
        Cookies.set("session_token", token);
        setUser({ username });
        navigate("/");
    };

    return (
        <div>
            <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="primary" onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
}
