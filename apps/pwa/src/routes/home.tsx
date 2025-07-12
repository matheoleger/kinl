import { Dashboard } from '@/features/links/dashboard';
import { authLoader } from '@/lib/auth-loader';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  await authLoader();
}

export default function Home() {
  return <Dashboard />;
}
