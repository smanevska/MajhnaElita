import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import {useNavigate} from "react-router";
export default function Settings() {
const navigate = useNavigate();
    const [user, setUser] = useState({
        first_name:"",
        last_name:"",
        email:"",
        phone:"",
        location:"",
        profile_picture:""
    });
    const [passwords,setPasswords] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
    const [selectedFile, setSelectedFile] = useState(null);
    useEffect(() =>{
        async function getUser(){
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://88.200.63.148:30170/users/me",
                {
                    headers:{Authorization:`Bearer ${token}`}
                }
            );
            const data = await response.json();

            if(data.success){
                setUser(data.user);
            }else{
                setUser(data);
            }
        }
        getUser();
    },[]);



async function saveProfile(){
    const token =localStorage.getItem("token");
    const formData=new FormData();
    formData.append("phone", user.phone);
    formData.append("location", user.location);
    if (selectedFile) {
        formData.append("profile_picture", selectedFile);
    }
    const response=await fetch(
        "http://88.200.63.148:30170/users/profile",
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`},
            body: formData
        }
    );
    const data = await response.json();
    alert(data.message);
    window.location.reload();
}

async function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
}

async function changePassword(){
const token = localStorage.getItem("token");
const response = await fetch(
"http://88.200.63.148:30170/users/password",
{
    method:"PUT",
    headers:{
    "Content-Type":"application/json",
    Authorization:`Bearer ${token}`  },
body:JSON.stringify(passwords)
}
);
const data = await response.json();
alert(data.message);
}

    return (
        <div className="app-shell">
            <Menu />

            <div className="main-area">

                <div className="topbar">
                    <input 
                        className="search" 
                        placeholder="Search"
                    />
                    <div className="actions">
                        <button className="icon-btn">🔔</button>
                        <button className="add-btn" onClick={()=>navigate("/add-item")} >+ Add New Item </button>
                    </div>
                </div>

                <div className="settings-container">
                    <div className="settings-card">
                        <h2>Profile Settings</h2>
                        <div className="profile">

                            <img
                        src={
                        selectedFile ?  URL.createObjectURL(selectedFile) : user.profile_picture ?   `http://88.200.63.148:30170/${user.profile_picture}` :  "/profile.png" }
                        className="profile-image"/>

                            <input
                                type="file"
                                accept="image/*"
                                capture="user"
                              onChange={handleImageChange} />
                        </div>

                        <div className="form-row">
                            <div>
                                <label>First Name</label>
                                <input 
                                  value={user.first_name}
                                  readOnly
                                />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input 
                                  value={user.last_name}
                                  readOnly
                                />
                            </div>
                        </div>

                        <label>Email</label>
                        <input 
                            value={user.email}
                            readOnly/>

                        <label>Phone number</label>
                        <input
                            type="tel"
                            value={!user.phone || user.phone === "null" ? "" : user.phone}
                            placeholder="Enter phone number"
                           onChange={(e)=>
                            setUser({ ...user, phone:e.target.value })} />
                        <label>Location</label>
                        <input
                            value={!user.location || user.location === "null" ? "" : user.location}
                            placeholder="Enter location"
                            onChange={(e)=>
                                setUser({...user,location:e.target.value})}/>

                        <button className="save-btn" onClick={saveProfile}>
                            Save Changes
                        </button>
                    </div>

                    <div className="settings-card">

                        <h2>Change Password</h2>

                        <label>Current Password</label>
                        <input type="password" value={passwords.currentPassword}
                            onChange={(e)=>
                                setPasswords({
                                ...passwords,
                            currentPassword:e.target.value})
                        }/>

                        <label>New Password</label>
                        <input type="password" value={passwords.newPassword}
                                onChange={(e)=>
                                    setPasswords({
                                    ...passwords,
                            newPassword:e.target.value})
                        }/>

                        <label>Confirm Password</label>
                        <input type="password" value={passwords.confirmPassword}
                                onChange={(e)=>
                                    setPasswords({
                                    ...passwords,
                                confirmPassword:e.target.value})
                        }/>

                        <button className="save-btn" onClick={changePassword}>
                            Update Password
                        </button>

                    </div>
                </div>

            </div>

        </div>
    );
}