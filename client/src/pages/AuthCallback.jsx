import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const AuthCallback = () => {
  const started = useRef(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getMe } = useAuth();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          throw new Error("OAuth code is missing.");
        }

        const { data } = await api.post("/auth/exchange", { code });

        if (!data.success || !data.token) {
          throw new Error(data.message || "Authentication failed.");
        }

        localStorage.setItem("token", data.token);

        await getMe();

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        navigate("/dashboard", { replace: true });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "OAuth login failed."
        );
      }
    };

    handleCallback();
  }, [getMe, navigate]);

  if (error) {
    return <p>Authentication failed: {error}</p>;
  }

  return <p>Signing you in...</p>;
};

export default AuthCallback;