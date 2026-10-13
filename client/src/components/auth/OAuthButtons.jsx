import { useState } from "react";
import api from "../../api/axios";
import { LoaderIcon } from "lucide-react";
const OAuthButtons = () => {
  const [loading, setLoading] = useState("");

  const handleOAuth = (provider) => {
    setLoading(provider);

    // Redirect browser to the OAuth provider through your backend
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/auth/${provider}`;
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-300" />
        <span className="text-sm text-gray-500">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-gray-300" />
      </div>

      <button
        type="button"
        onClick={() => handleOAuth("google")}
        disabled={!!loading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          className="h-5 w-5"
        />
        {loading === "google" ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          "Continue with Google"
        )}
      </button>

      <button
        type="button"
        onClick={() => handleOAuth("github")}
        disabled={!!loading}
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-white hover:bg-gray-800 disabled:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current"
          aria-hidden="true"
        >
          <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.28-2.61 5.23-5.1 5.5.4.35.75 1.02.75 2.06V22c0 .29.2.63.76.53A11.1 11.1 0 0 0 12 .9Z" />
        </svg>
        {loading === "github" ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          "Continue with GitHub"
        )}
      </button>
    </div>
  );
};

export default OAuthButtons;
