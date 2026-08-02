import { useState } from "react";
import { useNavigate } from "react-router";
import Steps from "../../components/Steps";

export default function AddItemPhoto() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    function next() {
    if (!image) {
        alert("Please select an image");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
        sessionStorage.setItem(
            "itemImage",
            reader.result
        );
        navigate("/add-item/details");
    };
    reader.readAsDataURL(image);
}
    return (
        <div>
            <Steps step={1} />
            <div className="item-page">

                <div className="item-card">

                    <h2>Upload Photo</h2>

                    <div className="upload-box">

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImage(e.target.files[0])
                            }
                        />

                    </div>

                    <div className="item-buttons">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="secondary-btn">
                            Back
                        </button>
                        <button
                            onClick={next}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}