import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Menu from "../components/Menu";


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
            </Routes>
        </BrowserRouter>

    );

}