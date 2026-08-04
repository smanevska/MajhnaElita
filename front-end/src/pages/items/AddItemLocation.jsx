import { useState} from "react";
import {useNavigate } from "react-router";
import Steps from "../../components/Steps";


export default function AddItemLocation() {
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const next = () => {
        if (location === "") {
            alert("Please enter location");
            return;
        }
        localStorage.setItem("itemLocation", location);
        navigate("/add-item/publish");
    }

    return (
        <div>
            <Steps step={4} />
            <div className="item-page">
                <div className="item-card">
                    <h2>Location</h2>
                    <h3>Final Details</h3>
                    <p className="description">
                        Add final details to complete your listing
                    </p>

                    <label>City</label>
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)} />

                    <div className="item-buttons">
                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/add-item/type")}> Back </button>
                        <button onClick={next}> Next  </button>
                    </div>
                </div>
            </div>
        </div>
    )
}