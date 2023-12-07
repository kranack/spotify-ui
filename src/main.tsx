import React from 'react'
import { Outlet } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.sass'

import Home from './Home'
import User from './User'
import Playlist, { loader as playlistLoader } from './Playlist'
import ErrorPage from './Error'
import PlaylistForm from './PlaylistForm'

/*
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
*/

function Root() {
  return (
    <>
      <Outlet /> 
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'user',
        element: <User />,
      },
      {
        path: 'playlist/:id',
        element: <Playlist />,
        loader: playlistLoader,
        children: [
          {
            path: ':offset',
            element: <Playlist />
          }
        ]
      },
      {
        path: 'playlist/create',
        element: <PlaylistForm />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
  </>
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
