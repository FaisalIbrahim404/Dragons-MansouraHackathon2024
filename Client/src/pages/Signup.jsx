import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Select, Checkbox, message } from "antd";
// import Cookies from "js-cookie";
import useUser from "../store/useUser";
import welcome from "/Images/welcome.png";
import { setCookie } from "../utils/cookies";

const { Option } = Select;

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);

  const handleSignup = async () => {
    if (!username || !email || !password || !role) {
      message.error("Please fill in all fields");
      return;
    }

    if (role !== "user" && services.length === 0) {
      message.error("Please select at least one service");
      return;
    }

    setLoading(true);

    const payload = {
      username,
      email,
      role,
      password,
      services: role !== "user" ? services : [],
    };

    try {
      const response = await fetch(
        "https://wincheck-production.up.railway.app/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();

      if (data.status === "success" && data.token) {
        setCookie("session_token", data.token, 7);

        setUser({ username, role });

        message.success("Signup successful!");
        navigate("/");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      message.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleServicesChange = (checkedValues) => {
    setServices(checkedValues);
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-[#D8EFF7]">
        <div className="flex flex-col md:flex-row md:rounded-2xl shadow-md overflow-hidden w-full max-md:h-full md:w-auto">
          <div className="bg-white flex flex-col justify-center items-center p-8 max-md:h-[100vh] w-full md:max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">
              Welcome to Wincheck
            </h2>
            <div className="flex flex-col gap-4 w-full">
              <div>
                <label htmlFor="username" className="text-[#4840A3] font-bold">
                  Username
                </label>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-[#4840A3] font-bold">
                  Email
                </label>
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-[#4840A3] font-bold">
                  Password
                </label>
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="type" className="text-[#4840A3] font-bold">
                  Type
                </label>
                <Select
                  placeholder="Select your role"
                  value={role}
                  onChange={(value) => setRole(value)}
                  className="w-full"
                >
                  <Option value="user">User</Option>
                  <Option value="driver">Driver</Option>
                  <Option value="mechanic">Mechanic</Option>
                </Select>
              </div>
              {(role === "driver" || role === "mechanic") && (
                <div>
                  <label
                    htmlFor="services"
                    className="text-[#4840A3] font-bold mr-4"
                  >
                    Services
                  </label>
                  <Checkbox.Group
                    options={[
                      { label: "Winch", value: 1 },
                      { label: "Repair", value: 2 },
                    ]}
                    onChange={handleServicesChange}
                  />
                </div>
              )}
              <Button
                color="default"
                variant="solid"
                onClick={handleSignup}
                loading={loading}
                className="mt-4"
              >
                Signup
              </Button>
              <div className="py-6">
                <span>Already have an Account? </span>
                <Link
                  to="/login"
                  className="text-[#4840A3] hover:text-[#EAB95C]"
                >
                  Login
                </Link>
              </div>
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
    </div>
  );
}
