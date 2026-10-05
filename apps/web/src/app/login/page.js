"use client";

import { useState } from "react";
import { loginAction } from "../actions/login";

export default function LoginPage() {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = await loginAction(formData);
    
    // loginAction redirects on success, so we only handle errors
    if (result && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-surface rounded-2xl border border-outline-variant shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-on-surface-variant">Sign in to manage forms</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl font-medium bg-[#fce8e6] text-[#c5221f] dark:bg-[#c5221f]/20 dark:text-[#f28b82]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@gform.local"
              defaultValue="admin@gform.local"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full min-h-[48px] px-4 py-2 bg-surface-bright border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              defaultValue="password123"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center min-h-[48px] bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
