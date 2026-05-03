import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useWorkerStore } from '@/stores/workerStore';

export default function RootLayout() {
  const init = useWorkerStore((state) => state.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col h-full bg-(--background)">
      <Header />
      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
