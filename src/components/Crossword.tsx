import "./Crossword.css";
import { useEffect, useState } from "react"; 
import Spinner from "./Spinner";

type Cell = {
    letter: string;
    hintNumber: number;
};

type Hint = {

}

export default function Crossword() {
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [horizontalHints, setHorizontalHints]: [string[], any] = useState([]);
    const [verticalHints, setVerticalHints]: [string[], any] = useState([]);
    const [board, setBoard]: [Cell[], any] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Response = await fetch("../assets/crossword.json");
                const hints = {
                    horizontal:[
                        {hintNumber: 1, hintText: "Bókhaldskerfi frá microsoft"},
                        {hintNumber: 2, hintText: "Upphrópum sem lýsir ánægju með sælgæti eða góðgæti!"},
                        {hintNumber: 3, hintText: "Að tengja saman efni með nál og þráð"},
                        {hintNumber: 4, hintText: "Nafn á kattardýrir eða vinsælu íþróttavörumerki"},
                        {hintNumber: 5, hintText: "Stefna eða leið"}
                    ],
                    vertical: [
                        {hintNumber: 1, hintText: "Ekki nægilegt"},
                        {hintNumber: 6, hintText: "Móðir móður eða föðurs"},
                        {hintNumber: 7, hintText: "Menntaskóli, stytting"},
                        {hintNumber: 2, hintText: "Dýrið sem heyrist baula á túnum"},
                        {hintNumber: 5, hintText: "Að reyna að sjá fyrir eða gera ráð fyrir einhverju"},
                    ]
                };

                const board = [
                    {letter: " ", hintNumber: null},
                    {letter: " ", hintNumber: null},
                    {letter: "N", hintNumber: 1},
                    {letter: "A", hintNumber: 6},
                    {letter: "V", hintNumber: 7},
                    {letter: " ", hintNumber: null},
                    {letter: "N", hintNumber: 2},
                    {letter: "A", hintNumber: null},
                    {letter: "M", hintNumber: null},
                    {letter: "M", hintNumber: null},
                    {letter: "S", hintNumber: 3},
                    {letter: "A", hintNumber: null},
                    {letter: "U", hintNumber: null},
                    {letter: "M", hintNumber: null},
                    {letter: "A", hintNumber: null},
                    {letter: "P", hintNumber: 4},
                    {letter: "U", hintNumber: null},
                    {letter: "M", hintNumber: null},
                    {letter: "A", hintNumber: null},
                    {letter: " ", hintNumber: null},
                    {letter: "Á", hintNumber: 5},
                    {letter: "T", hintNumber: null},
                    {letter: "T", hintNumber: null},
                    {letter: " ", hintNumber: null},
                    {letter: " ", hintNumber: null}
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

    if(loading) {
        return (
            <Spinner></Spinner>
        )
    }

    return (
        <div className="gameContainer">
            <div className="board">
                {
                board.map((cell, index) => {
                    if(cell.letter === " ") return <div className="empty"></div> 
                    return (
                    <div className="cell">
                        <div className="number">{cell.hintNumber}</div>
                        <input 
                            key={index} 
                            value={cell.letter}
                            onKeyDown={(e)=>"return /[a-z]/i.test(event.key)"}
                            onChange={(e)=> handleInputChange(index, e.target.value[0] || '')}
                            maxLength={1}>
                        </input> 
                    </div>

                )})
                }
            </div>
            <div className="hintContainer">
                <h2>Lárétt</h2>
                <ol>
                    {horizontalHints.map((hint, index) => {
                        return (<li className="hint">{hint.hintNumber}. {hint.hintText}</li>)
                    })}
                </ol>
                    
                <h2>Lóðrétt</h2>
                <ol>
                    {verticalHints.map((hint, index) => {
                        return (<li className="hint">{hint.hintNumber}. {hint.hintText}</li>)
                    })}
                </ol>

            </div>
        </div>
    );
}

