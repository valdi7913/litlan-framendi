import "./Crossword.css";
import { useEffect, useState } from "react"; 
import Spinner from "./Spinner";
export default function Crossword() {
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [board, setBoard]: [string[], any] = useState(
        Array.from(
            {length: 25}, 
            ()=>'',
        )
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Response = await fetch("../assets/crossword.json");
                const board = [
                    "B","A","S","S"," ",
                    "A","L","I","A","S",
                    "G","A","R","B","O",
                    "E","M","E","R","Y",
                    "L","O","N","E"," "
                ];
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
        const sanitizedValue = value.replace(/[^a-zA-ZÁÉÍÓÚÝÞÆÖáéíóúýþæö]/g, "").toUpperCase();

        let newBoard: string[] = [...board];
        newBoard[index] = sanitizedValue;
        console.log(newBoard);
        setBoard(newBoard);
    };

    if(loading) {
        return (
            <Spinner></Spinner>
        )
    }

    return (
        <div className="board">
            {
            board.map((value, index) => {
                if(value === " ") return <div className="empty"></div> 
                return (
                <input 
                    key={index} 
                    value={value}
                    className="cell" 
                    onKeyDown={(e)=>"return /[a-z]/i.test(event.key)"}
                    onChange={(e)=> handleInputChange(index, e.target.value[0] || '')}
                    maxLength={1}>
                </input> 
            )})
            }
        </div>
    );
}

