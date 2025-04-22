import React from 'react'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Homepage from './Homepage/Homepage'
import {Error} from "./Container"

const App = () => {
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "*",
    element: <Error />
  }
])


  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App