import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const okto = useOkto();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useCallback(async (credentialResponse: CredentialResponse) => {
    console.log("Google login response:", credentialResponse);
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("No Google ID token found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authResponse = await new Promise((resolve, reject) => {
        okto?.authenticate(idToken, (response, error) => {
          if (response && response.token) {
            resolve(response);
          } else {
            reject(error || new Error("Failed to authenticate with Okto"));
          }
        });
      });

      console.log("Auth token received", (authResponse as any).token);
      localStorage.setItem('oktoAuthToken', (authResponse as any).token);
      navigate("/games");
    } catch (error) {
      console.error("Authentication error:", error);
      setError((error as Error).message || "Failed to authenticate with Okto");
    } finally {
      setLoading(false);
    }
  }, [okto, navigate]);

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center m-0 p-0">
      <div className="rounded-lg border border-gray-400 bg-gray-800 flex flex-col w-full max-w-md p-8 items-center justify-center">
        <img
          src="mainlogo.png"
          alt="Main Logo"
          className="w-28 mb-6"
        />
        <h1 className="text-white text-2xl mb-4">Log In</h1>
        <p className="text-white mb-6">With your Google account</p>
        {/* {error && (

        )} */}
        {loading ? (
          <div className="text-white">Authenticating...</div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google Login Failed")}
            useOneTap
          />
        )}
      </div>
    </div>
  );
};
