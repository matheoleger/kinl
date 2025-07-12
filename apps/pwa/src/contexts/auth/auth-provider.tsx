import type { SafeUserSchema } from '@kinl/codegen-api';
import { createContext, use, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: any;
  loaded: boolean;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | null>({
  user: null,
  loaded: false,
  setUser: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUserSchema | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    apiClient.authControllerMe().then((res) => {
      if (res.error) {
        throw res.error;
      }
      else if (!res.data) {
        setUser(null);
        throw new Error('No user found');
      }

      setUser(res.data);
    }).finally(() => setLoaded(true));
  }, []);

  const value = useMemo(() => ({
    user,
    loaded,
    setUser,
  }), [user, loaded]);

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return use(AuthContext);
}
