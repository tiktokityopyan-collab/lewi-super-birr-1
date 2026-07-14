import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, User, X, CircleCheck } from "lucide-react";
import { toast } from "sonner";

interface AuthScreenProps {
  onAuth: (user: string) => void;
}

const MOCK_GOOGLE_ACCOUNTS = [
  { email: "lewi.dev@gmail.com", name: "Lewi Assefa", avatar: "LA" },
  { email: "user.tester@gmail.com", name: "User Tester", avatar: "UT" },
  { email: "ethio.fan@gmail.com", name: "Ethio Fan", avatar: "EF" },
];

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "google">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("lewi_user", JSON.stringify({ email, name: email.split("@")[0] }));
    toast.success("Welcome back!");
    onAuth(email);
  };

  const handleGoogleAuth = (account: { email: string; name: string }) => {
    localStorage.setItem("lewi_user", JSON.stringify({ email: account.email, name: account.name }));
    toast.success(`Signed in as ${account.name}`);
    onAuth(account.email);
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-rose-500/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-md"
          >
            {/* Glass card */}
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <span className="text-2xl font-bold text-white">L</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-white mb-2">Welcome to Lewi</h1>
              <p className="text-sm text-gray-400 text-center mb-8">
                Sign in to support the channel
              </p>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-[oklch(0.12_0.01_260)] text-gray-500">or continue with</span>
                </div>
              </div>

              {/* Google Account Button */}
              <motion.button
                onClick={() => setMode("google")}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Account
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="google"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-md"
          >
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setMode("login")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-white">Choose an account</h2>
                <div className="w-5" />
              </div>

              <div className="space-y-2">
                {MOCK_GOOGLE_ACCOUNTS.map((account) => (
                  <motion.button
                    key={account.email}
                    onClick={() => handleGoogleAuth(account)}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                      {account.avatar}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-medium text-sm">{account.name}</p>
                      <p className="text-gray-500 text-xs">{account.email}</p>
                    </div>
                    <CircleCheck className="w-5 h-5 text-emerald-500" />
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <motion.button
                  onClick={() => setMode("login")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Use a different account
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}