import { useState } from "react";
import { useNavigate } from "react-router";
import Steps from "../../components/Steps";

export default function AddItemType() {

    const navigate = useNavigate();
    const [type, setType] = useState(null);
    const [value, setValue] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    function next() {
        if (!type) {
            alert("Choose item type");
            return;
        }
        localStorage.setItem(
            "itemType",
            type
        );
        localStorage.setItem(
            "itemPrice",
            value || 0
        );
        localStorage.setItem(
            "rental_start",
            dateFrom
        );
        localStorage.setItem(
            "rental_end",
            dateTo
        );
        navigate("/add-item/location");
    }

    return (
        <div>
            <Steps step={3} />
            <div className="item-page">
                <div className="item-card">

                    <h2>Item Type</h2>

                    <div className="type-buttons">

                        <button
                            className={type === 1 ? "selected" : ""}
                            onClick={() => setType(1)}>
                            Sell
                        </button>

                        <button
                            className={type === 2 ? "selected" : ""}
                            onClick={() => setType(2)} >
                            Rent
                        </button>

                        <button
                            className={type === 3 ? "selected" : ""}
                            onClick={() => setType(3)}>
                            Donate
                        </button>

                    </div>

                    {type === 1 && (
                        <input
                            type="number"
                            placeholder="Selling price (€)"
                            onChange={(e) => setValue(e.target.value)} />
                    )
                    }

                    {
                        type === 2 && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Rent price per day (€)"
                                    onChange={(e) => setValue(e.target.value)} />

                                <input
                                    type="date"
                                    onChange={(e) => setDateFrom(e.target.value)} />

                                <input
                                    type="date"
                                    onChange={(e) => setDateTo(e.target.value)} />
                            </>
                        )}
                    {
                        type === 3 && (
                            <>
                                <div
                                    style={{
                                        background: "#eef9f1",
                                        color: "#1b8f4d",
                                        border: "1px solid #bde5c8",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        marginBottom: "15px",
                                        textAlign: "center",
                                        fontWeight: "600"
                                    }} >
                                    You'll earn <strong>+2 points</strong> for donating this item!
                                </div>
                            </>
                        )}
                    <div className="item-buttons">
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate("/add-item/details")}>
                            Back
                        </button>
                        <button
                            onClick={next} >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}