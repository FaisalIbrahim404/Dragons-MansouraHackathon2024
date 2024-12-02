import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, message } from "antd";
import useUser from "../store/useUser";
import welcome from "/Images/welcome.png";
import { setCookie } from "../utils/cookies";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://wincheck-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      if (data.status === "success" && data.token) {
        setCookie("session_token", data.token, 7);

        setUser({ email });

        message.success("Login successful!");
        navigate("/");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      message.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#D8EFF7]">
      <div className="flex flex-col md:flex-row md:rounded-2xl shadow-md overflow-hidden w-full md:w-auto">
        <div className="bg-white flex flex-col justify-center items-center p-8 w-full md:max-w-md max-md:h-[100vh]">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#4840A3]">
            Welcome Back!
          </h2>
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label htmlFor="email" className="text-[#4840A3] font-bold">
                Email
              </label>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-[#4840A3] font-bold">
                Password
              </label>
              <Input.Password
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              color="default"
              variant="solid"
              onClick={handleLogin}
              loading={loading}
            >
              Login
            </Button>
          </div>
          <div className="py-6">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-[#4840A3] hover:text-[#EAB95C]">
              Sign up
            </Link>
          </div>
        </div>
        <div className="hidden md:block w-full md:max-w-md">
          <img
            src={welcome}
            alt="Welcome"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
