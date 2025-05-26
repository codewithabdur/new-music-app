import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Homepage from './Homepage/Homepage'
import {Error} from "./Container"
import { ProfilePage, Login, RegisterPage } from "./Components"

const App = () => {
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "*",
    element: <Error />
  },
  {
    path: "/profile/:username",
    element: <ProfilePage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
])


  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App