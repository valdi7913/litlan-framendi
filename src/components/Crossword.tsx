import "./Crossword.css";
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

type Cell = {
    letter: string;
    hintNumber: number | null;
    isBlack: boolean;
};

type Hint = {
    number: number
    text: string,
}

type RowCol = {
    row: number,
    col: number
}

type HintApiResponse = {
    horizontal: Hint[],
    vertical: Hint[]
}

export default function Crossword() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [horizontalHints, setHorizontalHints] = useState<Hint[]>([]);
    const [verticalHints, setVerticalHints] = useState<Hint[]>([]);
    const [board, setBoard] = useState<Cell[]>([]);

    //Highlight and Keyboard handling
    const [selectedCell, setSelectedCell] = useState<number | null>(null);
    const [highlightDirection, setHighlightDirection] = useState<'row' | 'col'>('row');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    
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
                    { letter: " ", hintNumber: null, isBlack: true},
                    { letter: " ", hintNumber: null, isBlack: true},
                    { letter: "N", hintNumber: 1,    isBlack: false},
                    { letter: "A", hintNumber: 6,    isBlack: false},
                    { letter: "V", hintNumber: 7,    isBlack: false},
                    { letter: " ", hintNumber: null, isBlack: true},
                    { letter: "N", hintNumber: 2,    isBlack: false},
                    { letter: "A", hintNumber: null, isBlack: false},
                    { letter: "M", hintNumber: null, isBlack: false},
                    { letter: "M", hintNumber: null, isBlack: false},
                    { letter: "S", hintNumber: 3,    isBlack: false},
                    { letter: "A", hintNumber: null, isBlack: false},
                    { letter: "U", hintNumber: null, isBlack: false},
                    { letter: "M", hintNumber: null, isBlack: false},
                    { letter: "A", hintNumber: null, isBlack: false},
                    { letter: "P", hintNumber: 4,    isBlack: false},
                    { letter: "U", hintNumber: null, isBlack: false},
                    { letter: "M", hintNumber: null, isBlack: false},
                    { letter: "A", hintNumber: null, isBlack: false},
                    { letter: " ", hintNumber: null, isBlack: true},
                    { letter: "Á", hintNumber: 5,    isBlack: false},
                    { letter: "T", hintNumber: null, isBlack: false},
                    { letter: "T", hintNumber: null, isBlack: false},
                    { letter: " ", hintNumber: null, isBlack: true},
                    { letter: " ", hintNumber: null, isBlack: true}
                ];

                setHorizontalHints(hints.horizontal);
                setVerticalHints(hints.vertical);
                setBoard(board);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(()=> {
        const cellIsNotNull = selectedCell !== null;
        const cellIsNotBlack = selectedCell ? !board[selectedCell].isBlack : false;
        if(cellIsNotNull && cellIsNotBlack) {
            inputRefs.current[selectedCell]?.focus();
        }
    },[selectedCell, board])

    const getRowCol = (index: number): RowCol => ({
        row: Math.floor(index / 5),
        col: index % 5
    });

    const getIndex = (row: number, col: number) : number => row * 5 + col;

    const handleClick = (index: number) => {
        if(index === selectedCell) {
            const nextHighlightDirection = highlightDirection ? 'col' : 'row';
            setHighlightDirection(nextHighlightDirection);
        } else {
            setSelectedCell(index);
        }
    };

    const findNextInRow = (currentPos: RowCol, forward: boolean) : number => {
        let col = currentPos.col;
        const row = currentPos.row;

        for(let i = 0; i < 5; i++) {
            col = forward 
                ? (col + 1) % 5
                : (col - 1) % 5

            const index = getIndex(row,col);
            if(!board[index].isBlack) {
                return index;
            }
        }
        return 0;
    }

    const findNextInCol = (currentPos: RowCol, forward: boolean) : number => {
        let row = currentPos.row;
        const col = currentPos.col;

        for(let i = 0; i < 5; i++) {
            row = forward
                ? (row + 1) % 5
                : (row - 1) % 5
            const index = getIndex(row, col)
            if(!board[index].isBlack) {
                return index
            }
        }
        return 0;
    }

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        console.log(e.key, e.key === " ")
        if(e.key === "Tab") {
            e.preventDefault();

            const currentPos: RowCol = getRowCol(index);
            let nextIndex: number | null = null;

            if(highlightDirection === 'row') {
                nextIndex = findNextInCol(currentPos, !e.shiftKey);
            } else {
                nextIndex = findNextInRow(currentPos, !e.shiftKey);
            }

            setSelectedCell(nextIndex);
            inputRefs.current[nextIndex]?.focus();
            return;
        }
        if(e.key === " ") {
            e.preventDefault();

            const nextHighlightDirection = highlightDirection === 'row' ? 'col' : 'row';
            setHighlightDirection(nextHighlightDirection);
            return
        }
    };

    const handleInputChange = (index: number, value: string) => {
        const sanitizedValue = value.replace(/[^a-zA-ZÁÉÍÓÚÝÞÐÆÖáéíóúýþæöð]/g, "").toUpperCase();

        const newBoard: Cell[] = [...board];
        newBoard[index].letter = sanitizedValue;
        console.log(newBoard);
        setBoard(newBoard);
    };

    const shouldHighlight = (index: number): boolean => {
        if(selectedCell === null) return false;

        const selectedPos: RowCol = getRowCol(selectedCell);
        const currentPos: RowCol = getRowCol(index);

        if(highlightDirection === 'row') {
            return selectedPos.row === currentPos.row;
        } else {
            return selectedPos.col === currentPos.col;
        } 
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
                        board.map((cell: Cell, index: number) => {
                            if (cell.isBlack) {return <div key={index} className="empty"></div>}
                            return (
                                <div 
                                    className={`cell`}
                                    key={index}>
                                    <div className="number">{cell.hintNumber}</div>
                                    <input
                                        className={`${shouldHighlight(index) ? "highlight" : ""}`}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength={1}
                                        value={""}
                                        onClick={() => handleClick(index)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                                        onChange={(e) => {
                                            handleInputChange(index, e.target.value[0] || '')
                                            console.log(e.target.value[0])
                                        }}>
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
        </section>
    );
}

