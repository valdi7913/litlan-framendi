import "./HintContainer.css"
export default function HintContainer() {
    return (
        <div className="hint-container">
            <button className="left">&lt;-</button>
            <p>Press the keys on the keyboard to type the correct word</p>
            <button className="right">-&gt;</button>
        </div>
    )
}