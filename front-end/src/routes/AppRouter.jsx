import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Menu from "../components/Menu";
import Settings from "../pages/Settings";
import AddItemPhoto from "../pages/items/AddItemPhoto";
import AddItemDetails from "../pages/items/AddItemDetails";
import AddItemType from "../pages/items/AddItemType";
import AddItemLocation from "../pages/items/AddItemLocation";
import PublishItem from "../pages/items/PublishItem";
import Profile from "../pages/Profile";
export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />}/> 
            <Route path="/settings" element={<Settings />}/> 
            <Route path="/add-item" element={<AddItemPhoto/>}/>
            <Route path="/add-item/details" element={<AddItemDetails/>}/>
            <Route path="/add-item/type" element={<AddItemType/>}/>
            <Route path="/add-item/location" element={<AddItemLocation/>}/>
            <Route path="/add-item/publish" element={<PublishItem/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="*"  element={<Navigate to="/" />}/>
        </Routes>
        </BrowserRouter>

    );

}