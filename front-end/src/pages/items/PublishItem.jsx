import {useEffect,useState} from "react";
import {useNavigate} from "react-router";
import Steps from "../../components/Steps";
import { authFetch } from "../../api/api";

export default function PublishItem(){
    const navigate=useNavigate();
    const [message,setMessage]=useState("");
    const [publishing, setPublishing] = useState(false);
    async function publish(){
        if(publishing) return;
        setPublishing(true);
        try{
        const form=new FormData();
        const image = sessionStorage.getItem("itemImage");

            if(image){
                const blob = await fetch(image).then(r => r.blob());

            form.append(
                "image",
                blob,
                "item-image.png"
    );
}
        const details=JSON.parse(
            localStorage.getItem("itemDetails"));

        form.append("title",details.title);
        form.append("description",details.description);
        form.append("size",details.size || "");
        form.append("category",details.category || "");
        form.append("conditionn",details.conditionn || "");
        form.append("gender",details.gender || "unisex");
        form.append("age_group",details.age_group || "3-5");
        form.append("item_type_id",localStorage.getItem("itemType"));
        form.append("item_price",localStorage.getItem("itemPrice") || 0);
        form.append( "location",localStorage.getItem("itemLocation")|| "");
        form.append("rental_start",localStorage.getItem("rental_start") || "");
        form.append( "rental_end", localStorage.getItem("rental_end") || "");
        const token =localStorage.getItem("token");
        const response= await authFetch("/items",
            {
                method:"POST",
                body:form
            });
        const data=await response.json();
        console.log(data);
        if(data.success){
            setMessage("Item published successfully");
            setTimeout(()=>{ navigate("/dashboard");},1500);
        }
        else{
            setMessage(data.message || "Publishing failed");
        }
    }catch(error){
        console.log(error);
        setMessage("Publishing failed");
    }finally{
        setPublishing(false);
    }
}
const details = JSON.parse(
    localStorage.getItem("itemDetails") );

    return(
        <div>
            <Steps step={4}/>
            <div className="item-page">
                <div className="item-card">
                  <h2>Publish Item</h2>
                   <p className="description">
                        Review your item details before publishing
                    </p>

                    <div className="summary">
                        <p>
                            <strong>Title:</strong>
                            {details?.title}
                        </p>
                        <p>
                            <strong>Description:</strong>
                            {details?.description}
                        </p>
                        <p>
                            <strong>Category:</strong>
                            {details?.category}
                        </p>
                        <p>
                            <strong>Location:</strong>
                            {localStorage.getItem("itemLocation")}
                        </p>
                    </div>

                    <div className="item-buttons">
                        <button
                        className="secondary-btn"
                        onClick={()=>navigate("/add-item/location")}
                        >
                            Back
                        </button>
                     <button onClick={publish}disabled={publishing}>
                            {publishing ? "Publishing..." : "Publish"}
                        </button>
                    </div>

                    {message &&
                    <h3 style={{
                        marginTop:"25px",
                        padding:"14px",
                        borderRadius:"10px",
                        textAlign:"center",
                        fontSize:"16px",
                        fontWeight:"600",
                        color:message.includes("successfully") ? "#2e8b57" : "#d9534f",
                        backgroundColor:message.includes("successfully") ? "#eafaf0" : "#ffeaea"
                    }}>
                        {message}
                    </h3>
                    }
                </div>
            </div>
        </div>
    )}