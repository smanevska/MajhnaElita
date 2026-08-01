import { useNavigate} from "react-router";

export default function Steps({ step }) {
    const navigate = useNavigate();

    return(
    <div className="wizard">
    <button
    className="back-dashboard"
    onClick={()=>navigate("/dashboard")} >
         Back to Dashboard
    </button>


    <div className="steps">
        <div className={step>=1?"circle active":"circle"}>
            {step>1?"✓":"1"}
        </div>

        <div className="line"></div>

        <div className={step>=2?"circle active":"circle"}>
            {step>2?"✓":"2"}
        </div>

        <div className="line"></div>

        <div className={step>=3?"circle active":"circle"}>
            {step>3?"✓":"3"}
        </div>

        <div className="line"></div>

        <div className={step>=4?"circle active":"circle"}>
            4
        </div>

    </div>

</div>
);}