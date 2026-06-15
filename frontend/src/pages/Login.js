import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {

    try {

      const formData = new URLSearchParams();

      formData.append(
        "username",
        email
      );

      formData.append(
        "password",
        password
      );

      const response = await api.post(
        "/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          }
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      alert("Login Successful");
      navigate("/dashboard");

    } catch (error) {

      console.log(
        error.response?.data
      );

      alert("Login Failed");

    }
  };

  return (
    <div>

      <h1>AI Learning Assistant</h1>

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
      <p>
        Don't have an account?

        <a href="/register">
            Register
        </a>
        </p>

    </div>
  );
}

export default Login;