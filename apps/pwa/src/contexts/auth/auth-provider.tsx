import type { SafeUserSchema } from '@kinl/codegen-api';
import { createContext, use, useMemo, useState } from 'react';

interface AuthContextType {
  user: SafeUserSchema | null;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUserSchema | null>(null);

  const value = useMemo(() => ({
    user,
    setUser,
  }), [user]);

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
