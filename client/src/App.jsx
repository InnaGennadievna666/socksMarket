import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import axiosInstance, { setAccessToken } from './axiosInstance';
import Layout from './components/Layout';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import MeetingsPage from './components/pages/MeetingsPage';
import ProtectedRoute from './components/hoc/ProtectedRoute';
import AccountPage from './components/pages/AccountPage';

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    axiosInstance('/tokens/refresh').then(({ data }) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
    }).catch(() => {
      setUser(null);
      setAccessToken('');
    });
  }, []);

  const signUpHandler = async (e) => {
    try {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      const { data } = await axiosInstance.post('/auth/signup', formData);
      setUser(data.user);
      setAccessToken(data.accessToken);
    } catch (error) {
      alert(error.response.data.message || 'Oops!');
    }
  };

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      const { data } = await axiosInstance.post('/auth/login', formData);
      setUser(data.user);
      setAccessToken(data.accessToken);
    } catch (error) {
      alert(error.response.data.message || 'Oops!');
    }
  };

  const logoutHandler = async () => {
    await axiosInstance('/auth/logout');
    setUser(null);
    setAccessToken('');
  };

  const router = createBrowserRouter([
    {
      element: <Layout user={user} logoutHandler={logoutHandler} />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/meetings',
          element: <MeetingsPage user={user} />,
        },
        {
          path: '/meetings/account',
          element: <ProtectedRoute isAllowed={!!user} redirect="/login"><AccountPage /></ProtectedRoute>,
        },
        {
          element: <ProtectedRoute isAllowed={!user} />,
          children: [
            {
              path: '/signup',
              element: <SignUpPage signUpHandler={signUpHandler} />,
            },
            {
              path: '/login',
              element: <LoginPage loginHandler={loginHandler} />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
