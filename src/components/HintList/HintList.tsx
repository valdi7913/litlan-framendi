import { Hint } from "../../types"
import "./HintList.css"

export default function HintList(horizontalHints: Hint[], verticalHints: Hint[], selectedCell: number | null, highlightDirection: "row" | "col") {

    return (
        <div className="hintContainer">
            <h2>Lárétt</h2>
            <ol>
                {horizontalHints.map(
                    (hint: Hint, index: number) => (
                        <li
                            key={index + "h"}
                            className={`hint ${getHighlightedHintIndex(selectedCell ?? 0) === index && highlightDirection === "row" ? "highlight" : ""}`}>
                            {hint.id}. {hint.text}
                        </li>
                    )
                )}
            </ol>

            <h2>Lóðrétt</h2>
            <ol>
                {verticalHints.map(
                    (hint: Hint, index: number) => (
                        <li
                            key={index}
                            className={`hint ${getHighlightedHintIndex(selectedCell ?? 0) === index && highlightDirection === "col" ? "highlight" : ""}`}>
                            {hint.id}. {hint.text}
                        </li>
                    )
                )}
            </ol>
        </div>
    )
}
