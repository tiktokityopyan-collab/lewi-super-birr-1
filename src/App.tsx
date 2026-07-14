import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import AuthScreen from "./components/AuthScreen";
import MainPortal from "./components/MainPortal";

type AppScreen = "auth" | "portal";

function App() {
  const [screen, setScreen] = useState<AppScreen>("auth");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lewi_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setScreen("portal");
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  const handleAuth = (email: string) => {
    setUser({ email, name: email.split("@")[0] });
    setScreen("portal");
  };

  const handleLogout = () => {
    localStorage.removeItem("lewi_user");
    setUser(null);
    setScreen("auth");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {screen === "auth" ? (
        <AuthScreen onAuth={handleAuth} />
      ) : (
        user && <MainPortal user={user} onLogout={handleLogout} />
      )}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.015 260)",
            border: "1px solid oklch(0.25 0.01 260)",
            color: "oklch(0.97 0 0)",
          },
        }}
      />
    </div>
  );
}

export default App;