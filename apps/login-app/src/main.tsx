import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginPage } from './pages/login-page'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
], {
  basename: '/login'
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)