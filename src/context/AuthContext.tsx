import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { defaultAvatarFromSeed } from "@/lib/defaultAvatar";

export type AuthMethod = "google" | "email" | "guest";

export type UserProfile = {
  displayName: string;
  photoUrl: string | null;
};

type User = {
  id: string;
  method: AuthMethod;
  email?: string;
};

const STORAGE_KEY = "greetings-app-auth-v1";

type Stored = {
  user: User | null;
  profile: UserProfile | null;
};

function loadStored(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, profile: null };
    return JSON.parse(raw) as Stored;
  } catch {
    return { user: null, profile: null };
  }
}

function saveStored(data: Stored) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  profileComplete: boolean;
  loginGuest: () => void;
  loginEmail: (email: string, password: string) => void;
  loginGoogleDemo: () => void;
  logout: () => void;
  updateProfile: (p: UserProfile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let s = loadStored();
    if (s.profile?.displayName?.trim() && !s.profile.photoUrl) {
      const photoUrl = defaultAvatarFromSeed(
        s.user?.id ?? s.profile.displayName
      );
      s = { ...s, profile: { ...s.profile, photoUrl } };
      saveStored(s);
    }
    setUser(s.user);
    setProfile(s.profile);
  }, []);

  const persist = useCallback((u: User | null, p: UserProfile | null) => {
    setUser(u);
    setProfile(p);
    saveStored({ user: u, profile: p });
  }, []);

  const loginGuest = useCallback(() => {
    persist(
      { id: `guest-${crypto.randomUUID()}`, method: "guest" },
      null
    );
  }, [persist]);

  const loginEmail = useCallback(
    (email: string, _password: string) => {
      void _password;
      persist(
        {
          id: `email-${crypto.randomUUID()}`,
          method: "email",
          email: email.trim(),
        },
        null
      );
    },
    [persist]
  );

  const loginGoogleDemo = useCallback(() => {
    persist(
      {
        id: `google-${crypto.randomUUID()}`,
        method: "google",
        email: "demo@gmail.com",
      },
      null
    );
  }, [persist]);

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const updateProfile = useCallback(
    (p: UserProfile) => {
      saveStored({ user, profile: p });
      setProfile(p);
    },
    [user]
  );

  const profileComplete = Boolean(
    profile?.displayName?.trim() && profile.photoUrl
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      profileComplete,
      loginGuest,
      loginEmail,
      loginGoogleDemo,
      logout,
      updateProfile,
    }),
    [
      user,
      profile,
      profileComplete,
      loginGuest,
      loginEmail,
      loginGoogleDemo,
      logout,
      updateProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
