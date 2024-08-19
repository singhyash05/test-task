// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import React from 'react'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import Dashboard from './Dashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path:'/login',
    element:<LoginPage/>
  },
  {
    path:'/dashboard',
    element:<Dashboard/>
  },
  {
    path:'/register',
    element:<RegisterPage/>
  }
])


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* <AuthProvider> */}
      <RouterProvider router={router} />
    {/* </AuthProvider> */}
  </React.StrictMode>
);

