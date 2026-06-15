import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");

  const navigate = useNavigate();

  const handleRegister = async () => {

    try {

      await api.post(
        "/register",
        {
          name,
          email,
          password,
          role
        }
      );

      alert(
        "Registration Successful"
      );

      navigate("/");

    } catch (error) {

      console.log(
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
        "Registration Failed"
      );

    }
  };

  return (
    <div>

      <h1>AI Learning Assistant</h1>

      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br />
      <br />

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

      <select
        onChange={(e) =>
          setRole(e.target.value)
        }
      >
        <option value="Student">
          Student
        </option>

        <option value="Instructor">
          Instructor
        </option>
      </select>

      <br />
      <br />

      <button
        onClick={handleRegister}
      >
        Register
      </button>

    </div>
  );
}

export default Register;