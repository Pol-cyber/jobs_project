import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { UnlogginedUserRoute } from "./permission/unlogined-user-route";
import { AuthPage } from "../../pages/auth";
import { LogginedUser } from "./permission/loggined-user-route";
import { HomePage } from "../../pages/home";



export const router = createBrowserRouter([
    {
        path: '',
        element: <App></App>,
        children: [
            {
                path: 'login',
                element: <UnlogginedUserRoute>
                    <AuthPage type="login"></AuthPage>
                </UnlogginedUserRoute>
            },
            {
                path: 'register',
                element: <UnlogginedUserRoute>
                    <AuthPage type="register"></AuthPage>
                </UnlogginedUserRoute>
            },
            {
                path: '',
                element: <LogginedUser>
                    <HomePage></HomePage>
                </LogginedUser>
            }
        ]
    }
])