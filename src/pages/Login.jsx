import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("consumer");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        await API.post("/users/register", {
          name,
          email,
          password,
          role,
          storeName: role === "store" ? storeName : null
        });

        alert("User created! Now login.");
        setIsRegister(false);
      } else {
        const res = await API.post("/users/login", {
          email,
          password
        });

        const user = res.data.user;

        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "consumer") {
          navigate("/consumer");
        }

        if (user.role === "store") {
          navigate("/store");
        }

        if (user.role === "delivery") {
          navigate("/delivery");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Error. Check console.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#111" }}>
          {isRegister ? "Register" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          {isRegister && (
            <>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
              >
                <option value="consumer">Consumer</option>
                <option value="store">Store</option>
                <option value="delivery">Delivery</option>
              </select>

              {role === "store" && (
                <input
                  type="text"
                  placeholder="Store Name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                  }}
                />
              )}
            </>
          )}

          <button
            type="submit"
            style={{
              background: "#ff441f",
              border: "none",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {isRegister ? "Create account" : "Login"}
          </button>
        </form>

        <p
          onClick={() => setIsRegister(!isRegister)}
          style={{
            marginTop: "15px",
            textAlign: "center",
            cursor: "pointer",
            color: "#ff441f"
          }}
        >
          {isRegister ? "Already have an account? Login" : "Create an account"}
        </p>
      </div>
    </div>
  );
}

export default Login;