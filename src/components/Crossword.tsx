import "./Crossword.css";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

type Cell = {
    letter: string;
    hintNumber: number | null;
};

type Hint = {
    number: number
    text: string,
}

type HintApiResponse = {
    horizontal: Hint[],
    vertical: Hint[]
}

export default function Crossword() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [horizontalHints, setHorizontalHints] = useState<Hint[]>([]);
    const [verticalHints, setVerticalHints] = useState<Hint[]>([]);
    const [board, setBoard] = useState<Cell[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hints: HintApiResponse = {
                    horizontal: [
                        { number: 1, text: "Bókhaldskerfi frá microsoft" },
                        { number: 2, text: "Upphrópum sem lýsir ánægju með sælgæti eða góðgæti!" },
                        { number: 3, text: "Að tengja saman efni með nál og þráð" },
                        { number: 4, text: "Nafn á kattardýrir eða vinsælu íþróttavörumerki" },
                        { number: 5, text: "Stefna eða leið" }
                    ],
                    vertical: [
                        { number: 1, text: "Ekki nægilegt" },
                        { number: 6, text: "Móðir móður eða föðurs" },
                        { number: 7, text: "Menntaskóli, stytting" },
                        { number: 2, text: "Dýrið sem heyrist baula á túnum" },
                        { number: 5, text: "Að reyna að sjá fyrir eða gera ráð fyrir einhverju" },
                    ]
                };

                const board: Cell[] = [
                    { letter: " ", hintNumber: null },
                    { letter: " ", hintNumber: null },
                    { letter: "N", hintNumber: 1 },
                    { letter: "A", hintNumber: 6 },
                    { letter: "V", hintNumber: 7 },
                    { letter: " ", hintNumber: null },
                    { letter: "N", hintNumber: 2 },
                    { letter: "A", hintNumber: null },
                    { letter: "M", hintNumber: null },
                    { letter: "M", hintNumber: null },
                    { letter: "S", hintNumber: 3 },
                    { letter: "A", hintNumber: null },
                    { letter: "U", hintNumber: null },
                    { letter: "M", hintNumber: null },
                    { letter: "A", hintNumber: null },
                    { letter: "P", hintNumber: 4 },
                    { letter: "U", hintNumber: null },
                    { letter: "M", hintNumber: null },
                    { letter: "A", hintNumber: null },
                    { letter: " ", hintNumber: null },
                    { letter: "Á", hintNumber: 5 },
                    { letter: "T", hintNumber: null },
                    { letter: "T", hintNumber: null },
                    { letter: " ", hintNumber: null },
                    { letter: " ", hintNumber: null }
                ];

                setHorizontalHints(hints.horizontal);
                setVerticalHints(hints.vertical);
                setBoard(board);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleInputChange = (index: number, value: string) => {
        const sanitizedValue = value.replace(/[^a-zA-ZÁÉÍÓÚÝÞÐÆÖáéíóúýþæöð]/g, "").toUpperCase();

        let newBoard: Cell[] = [...board];
        newBoard[index].letter = sanitizedValue;
        console.log(newBoard);
        setBoard(newBoard);
    };

    const checkPuzzle = () => {

    }

    if (loading) {
        return (
            <Spinner></Spinner>
        )
    }

    return (
        <section>
            <div className="gameContainer">
                <div className="board">
                    {
                        board.map((cell, index) => {
                            if (cell.letter === " ") return <div className="empty"></div>
                            return (
                                <div className="cell">
                                    <div className="number">{cell.hintNumber}</div>
                                    <input
                                        key={index}
                                        value={cell.letter}
                                        onKeyDown={(e) => "return /[a-z]/i.test(event.key)"}
                                        onChange={(e) => handleInputChange(index, e.target.value[0] || '')}
                                        maxLength={1}>
                                    </input>
                                </div>

                            )
                        })
                    }
                </div>
                <div className="hintContainer">
                    <h2>Lárétt</h2>
                    <ol>
                        {horizontalHints.map(
                            (hint: Hint, index: number) => (
                                <li key={index} className="hint">
                                    {hint.number}. {hint.text}
                                </li>
                            )
                        )}
                    </ol>

                    <h2>Lóðrétt</h2>
                    <ol>
                        {verticalHints.map((hint: Hint, index: number) => (
                            <li key={index} className="hint">
                                {hint.number}. {hint.text}
                            </li>
                        )
                        )}
                    </ol>
                </div>
            </div>
            <button className="answerButton" onClick={() => { checkPuzzle(); }}>
                Check
            </button>
        </section>
    );
}

