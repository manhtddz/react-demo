import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginPage } from '../pages/Login'
import { PrivateRouter } from './PrivateRouter'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/Home'
import { UserListPage } from '../pages/UserList'
import { UserCreatePage } from '../pages/UserCreate'

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
    {
        element: <PrivateRouter />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/',
                        element: <HomePage />,
                    },
                    {
                        path: '/users',
                        element: <UserListPage />,
                    },
                    {
                        path: '/users/create',
                        element: <UserCreatePage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
])