import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Menu from "../components/Menu";
import Settings from "../pages/Settings";

export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>

                <Route 
                    path="/" 
                    element={<Register />} 
                />
                <Route 
                    path="/login" 
                    element={<Login />} 
                />
                <Route 
                    path="/dashboard" 
                    element={<Dashboard />}
                />
                <Route 
                    path="*" 
                    element={<Navigate to="/" />}
                />
                <Route
                path="/settings"
                element={<Settings />}/>
            </Routes>
        </BrowserRouter>

    );

}