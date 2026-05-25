import { useEffect } from 'react';
import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useWorkerStore } from '@/stores/workerStore';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import HomePage from '@/pages/HomePage';
import ChallengePage from '@/pages/ChallengePage';

function RootLayout() {
  const init = useWorkerStore((state) => state.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-(--background)">
        <Header />
        <main className="flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'challenge/:id', element: <ChallengePage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
