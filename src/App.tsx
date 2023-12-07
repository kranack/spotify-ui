import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.sass'

import Home from './Home'
import User from './User'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/user',
      element: <User user={null} />
    }
  ])
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
