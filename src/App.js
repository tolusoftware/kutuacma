import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserMiddleware from "./Middleware/UserMiddleware";
import NotFound from './components/NotFound';

export default function App() {
  const router = createBrowserRouter([
    {path:"/",element:<NotFound/>},
    {path:"/:userid",element:<UserMiddleware/>},
    {path:"/:userid/admin",element:<UserMiddleware/>}
  ])
  return <RouterProvider router={router}/>
}
