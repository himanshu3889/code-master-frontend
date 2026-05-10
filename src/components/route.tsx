import { createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import ProblemPage from './Pages/Problem/Index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/problem/:id',
    element: <ProblemPage />,
  },
]);
export default router;
