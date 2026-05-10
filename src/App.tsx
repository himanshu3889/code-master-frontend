import { RouterProvider } from 'react-router';
import router from './components/route';
import ThemeWrapper from './context/ThemeWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <ThemeWrapper>
          <Toaster richColors position="top-right" />
          <RouterProvider router={router}></RouterProvider>
        </ThemeWrapper>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
