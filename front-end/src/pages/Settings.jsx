import { useEffect, useState } from "react";
import Menu from "../components/Menu";

export default function Settings() {

    const [user, setUser] = useState({
        first_name:"",
        last_name:"",
        email:"",
        phone:"",
        location:"",
        profile_picture:""
    });
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
}

async function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
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
                        <button className="icon-btn">🛒</button>
                        <button className="icon-btn">🔔</button>
                        <button className="add-btn">
                            + Add New Item
                        </button>
                    </div>
                </div>

                <div className="settings-container">
                    <div className="settings-card">
                        <h2>Profile Settings</h2>
                        <div className="profile">

                            <img
                        src={selectedFile
                            ? URL.createObjectURL(selectedFile)
                            :user.profile_picture || "/profile.png" 
                            ? `http://88.200.63.148:30170/${user.profile_picture}`
                            : "/profile.png"}
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
                            readOnly
                        />

                        <label>Phone number</label>
                        <input
                            value={user.phone || ""}
                           onChange={(e)=>
                            setUser({ ...user, phone:e.target.value })} />
                        <label>Location</label>
                        <input
                            value={user.location || ""}
                            onChange={(e)=>
                                setUser({...user,location:e.target.value})}/>

                        <button className="save-btn" onClick={saveProfile}>
                            Save Changes
                        </button>
                    </div>

                    <div className="settings-card">

                        <h2>Change Password</h2>

                        <label>Current Password</label>
                        <input type="password"/>

                        <label>New Password</label>
                        <input type="password"/>

                        <label>Confirm Password</label>
                        <input type="password"/>

                        <button className="save-btn">
                            Update Password
                        </button>

                    </div>

                    <div className="settings-card">
                        <h2>Payment Methods</h2>

                        <div className="payment">
                            Visa ****4242
                            <span>
                                Default
                            </span>
                        </div>

                        <button className="add-btn">
                            Add Payment Method
                        </button>

                    </div>
                </div>

            </div>

        </div>
    );
}