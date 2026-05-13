import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, profileComplete, loginGuest, loginEmail, loginGoogleDemo } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user && profileComplete) {
    navigate("/", { replace: true });
    return null;
  }
  if (user && !profileComplete) {
    navigate("/profile", { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Custom Greetings
          </h1>
          <p className="mt-2 text-slate-400">
            Sign in to create personalized cards with your name and photo.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <button
            type="button"
            onClick={() => {
              loginGoogleDemo();
              navigate("/profile");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-white py-3 font-medium text-slate-900 transition hover:bg-slate-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google (demo)
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-950 px-2 text-slate-500">or email</span>
          </div>
        </div>

        <form
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            loginEmail(email, password);
            navigate("/profile");
          }}
        >
          <label className="block">
            <span className="mb-1 flex items-center gap-1 text-sm text-slate-400">
              <Mail className="h-4 w-4" /> Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-indigo-500 focus:ring-2"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1 text-sm text-slate-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-indigo-500 focus:ring-2"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            <LogIn className="h-5 w-5" />
            Continue with email
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            loginGuest();
            navigate("/profile");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 font-medium text-slate-300 transition hover:bg-slate-900"
        >
          <User className="h-5 w-5" />
          Continue as guest
        </button>
      </div>
    </div>
  );
}
