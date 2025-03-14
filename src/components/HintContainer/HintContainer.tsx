import "./HintContainer.css"
import {
    FaArrowLeft,
    FaArrowRight
} from "react-icons/fa6";

export default function HintContainer({ hint }: { hint: string }) {

    const handleLeft = () => {
        console.log("Left button clicked");
    }

    const handleRight = () => {
        console.log("Right button clicked");
    }

    return (
        <div className="hint-container">
            <button onClick={handleLeft} className="left">
                <FaArrowLeft />
            </button>
            <p className="mid">{hint}</p>
            <button onClick={handleRight} className="right">
                <FaArrowRight />
            </button>
        </div>
    )
}
