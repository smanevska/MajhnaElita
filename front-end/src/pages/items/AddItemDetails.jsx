import { useState } from "react";
import { useNavigate } from "react-router";
import Steps from "../../components/Steps";

export default function AddItemDetails() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        title:"",
        description:"",
        size: "",
        category:"",
        conditionn:"",
        gender:"",
        age_group:""
    });

    function change(e) {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    
    function next() {
        if (
            !data.title ||
            !data.description ||
            !data.category ||
            !data.conditionn ||
            !data.gender ||
            !data.age_group
        ) {
            alert("Please fill all required fields");
            return;
        }
        localStorage.setItem(
            "itemDetails",
            JSON.stringify(data)
        );
        navigate("/add-item/type");
    }

    return (
        <div>
            <Steps step={2} />
            <div className="item-page">
                <div className="item-card">
                    <h2>Item Details</h2>
                    <label>Title</label>
                    <input
                        name="title"
                        placeholder="Add title"
                        onChange={change}
                    />
                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Describe your item"
                        onChange={change}
                    />

                    <label>Size</label>
                    <input
                        name="size"
                        placeholder="Optional"
                        onChange={change}
                    />

                    <label>Category</label>
                    <select
                        name="category"
                        onChange={change}>
                        <option value="">
                            Select category
                        </option>

                        <option value="Clothing">
                            Clothing
                        </option>

                        <option value="Shoes">
                            Shoes
                        </option>

                        <option value="Toys">
                            Toys
                        </option>

                        <option value="Books">
                            Books
                        </option>

                        <option value="Baby Gear">
                            Baby Gear
                        </option>

                        <option value="School Supplies">
                            School Supplies
                        </option>

                        <option value="Sports & Outdoor">
                            Sports & Outdoor
                        </option>

                        <option value="Furniture">
                            Furniture
                        </option>

                        <option value="Feeding Essentials">
                            Feeding Essentials
                        </option>

                        <option value="Health & Safety">
                            Health & Safety
                        </option>

                        <option value="Maternity">
                            Maternity
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                    <label>Condition</label>

                    <select
                        name="conditionn"
                        onChange={change}>

                        <option value="">
                            Select condition
                        </option>

                        <option value="new">
                            New
                        </option>

                        <option value="good">
                            Good
                        </option>

                        <option value="worn">
                            Worn
                        </option>

                    </select>



                    <label>Gender</label>

                    <select
                        name="gender"
                        onChange={change}>

                        <option value="">
                            Select gender
                        </option>

                        <option value="male">
                            Male
                        </option>

                        <option value="female">
                            Female
                        </option>

                        <option value="unisex">
                            Unisex
                        </option>

                    </select>



                    <label>Age group</label>

                    <select
                        name="age_group"
                        onChange={change}>

                        <option value="">
                            Select age
                        </option>

                        <option value="3-5">
                            3-5
                        </option>

                        <option value="5-8">
                            5-8
                        </option>

                        <option value="8-13">
                            8-14
                        </option>

                        <option value="13+">
                            14+
                        </option>
                    </select>
                    <div className="item-buttons">
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate("/add-item")}>
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