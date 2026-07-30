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
                              src={user.profile_picture || "/profile.png"}
                              className="profile-image"
                            />

                            <button className="change-btn">
                                Change Photo
                            </button>
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
                            placeholder="+386"
                        />

                        <label>Location</label>
                        <input 
                            value={user.location || ""}
                        />

                        <button className="save-btn">
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