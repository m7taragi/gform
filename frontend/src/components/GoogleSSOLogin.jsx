import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

/**
 * Decodes a Google JWT ID Token without requiring heavy external libraries
 */
function parseGoogleJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.warn("Failed to parse Google JWT payload:", e);
        return null;
    }
}

/**
 * GoogleSSOLogin Component
 * Supports real Google OAuth via @react-oauth/google and instant fallback/demo mode.
 */
export default function GoogleSSOLogin({ onGoogleSuccess, selectedRole = "employee" }) {
    const [isSimulating, setIsSimulating] = useState(false);

    // Handler for successful Google OAuth authentication
    const handleSuccess = (credentialResponse) => {
        if (!credentialResponse || !credentialResponse.credential) {
            console.error("No credential returned from Google SSO");
            return;
        }

        const payload = parseGoogleJwt(credentialResponse.credential);
        const googleUser = {
            name: payload?.name || "Google User",
            email: payload?.email || "user@gmail.com",
            picture: payload?.picture || null,
            googleId: payload?.sub || "g_sso_" + Date.now(),
            role: selectedRole,
            token: credentialResponse.credential,
            authProvider: "google"
        };

        if (onGoogleSuccess) {
            onGoogleSuccess(googleUser);
        }
    };

    const handleError = () => {
        console.warn("Google SSO Login Failed or standard Client ID unconfigured.");
    };

    // Instant One-Click Google SSO Demo Trigger for testing without setting up GCP credentials
    const handleDemoGoogleSSO = () => {
        setIsSimulating(true);
        setTimeout(() => {
            const mockGoogleUser = {
                name: "Alex Rivera (Google Workspace)",
                email: "alex.rivera@googleworkspace.com",
                picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
                googleId: "google_sub_109283746",
                role: selectedRole,
                token: "mock_google_oauth_jwt_token_" + Date.now(),
                authProvider: "google"
            };

            if (onGoogleSuccess) {
                onGoogleSuccess(mockGoogleUser);
            }
            setIsSimulating(false);
        }, 400);
    };

    return (
        <div className="w-full space-y-3">
            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Or Sign In With</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Official Google OAuth Component */}
            <div className="flex justify-center w-full">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="continue_with"
                    shape="rectangular"
                />
            </div>

            {/* Branded Fallback / Fast-Dev Google SSO Button */}
            <button
                type="button"
                onClick={handleDemoGoogleSSO}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                </svg>
                <span>{isSimulating ? "Authenticating Google Account..." : "Instant Google SSO Sign-In"}</span>
            </button>
        </div>
    );
}
