import { Cell, Hint, RowCol } from "../../types";
import HintContainer from "../HintContainer/HintContainer";
import { Keyboard } from "../Keyboard/Keyboard";
import Spinner from "../Spinner/Spinner";
import "./Crossword.css";
import { useEffect, useRef, useState } from "react";

export function getHighlightedHintIndex(selectedCellIndex: number, highlightDirection: 'row' | 'col'): number {
    if (highlightDirection === "row") {
        return Math.floor(selectedCellIndex / 5);
    } else {
        return selectedCellIndex % 5;
    }
}

export default function Crossword() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [horizontalHints, setHorizontalHints] = useState<Hint[]>([]);
    const [verticalHints, setVerticalHints] = useState<Hint[]>([]);
    const [board, setBoard] = useState<Cell[]>([]);

    //Highlight and Keyboard handling
    const [selectedCell, setSelectedCell] = useState<number | null>(null);
    const [highlightDirection, setHighlightDirection] = useState<'row' | 'col'>('row');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [deadWasLastPressed, setDeadWasLastPressed] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //read the daily.json file until we have a backend
                const response = await fetch("./daily.json");
                const data = await response.json();
                console.log(data);
                const horizontalHints = data.hints.filter((hint: Hint) => hint.direction === "Horizontal")
                const verticalHints = data.hints.filter((hint: Hint) => hint.direction === "Vertical")
                setHorizontalHints(horizontalHints);
                setVerticalHints(verticalHints);
                setBoard(data.cells);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const cellIsNotNull = selectedCell !== null;
        const cellIsNotBlack = selectedCell ? !board[selectedCell].is_blank : false;
        if (cellIsNotNull && cellIsNotBlack) {
            inputRefs.current[selectedCell]?.focus();
        }
    }, [selectedCell, board])

    const getRowCol = (index: number): RowCol => ({
        row: Math.floor(index / 5),
        col: index % 5
    });

    const getIndex = (row: number, col: number): number => row * 5 + col;

    function wrap(value: number, min: number, max: number): number {
        return ((value - min) % (max - min) + (max - min)) % (max - min) + min;
    }

    const handleClick = (index: number) => {
        if (index === selectedCell) {
            const nextHighlightDirection = highlightDirection === "row" ? 'col' : 'row';
            setHighlightDirection(nextHighlightDirection);
        } else {
            setSelectedCell(index);
        }
    };

    const findNextInRow = (currentPos: RowCol, forward: boolean): number => {
        let col = currentPos.col;
        const row = currentPos.row;

        for (let i = 0; i < 5; i++) {
            col = forward
                ? wrap(col + 1, 0, 5)
                : wrap(col - 1, 0, 5)

            const index = getIndex(row, col);
            if (!board[index].is_blank) {
                return index;
            }
        }
        return 0;
    }

    const findNextInCol = (currentPos: RowCol, forward: boolean): number => {
        let row = currentPos.row;
        const col = currentPos.col;

        for (let i = 0; i < 5; i++) {
            row = forward
                ? wrap(row + 1, 0, 5)
                : wrap(row - 1, 0, 5);
            const index = getIndex(row, col)
            if (!board[index].is_blank) {
                return index
            }
        }
        return 0;
    }

    const findNextInRowTab = (currentPos: RowCol, forward: boolean): number => {
        let row = currentPos.row;

        for (let i = 0; i < 5; i++) {
            row = forward
                ? wrap(row + 1, 0, 5)
                : wrap(row - 1, 0, 5);
            for (let col = 0; col < 5; col++) {
                const index = getIndex(row, col);
                console.log("Checking index ", index)
                if (!board[index].is_blank) {
                    return index
                }
            }
        }

        return 0;
    }

    const findNextInColTab = (currentPos: RowCol, forward: boolean): number => {
        let col = currentPos.col;

        for (let i = 0; i < 5; i++) {
            col = forward
                ? wrap(col + 1, 0, 5)
                : wrap(col - 1, 0, 5);
            for (let row = 0; row < 5; row++) {
                const index = getIndex(row, col);
                console.log("Checking index ", index)
                if (!board[index].is_blank) {
                    return index
                }
            }
        }

        return 0;
    }

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        //Todo breyta í switch statement, cant be bothered
        const currentPos = getRowCol(index);
        console.log(e.key, e.key === "ArrowUp")
        if (
            e.key === "Escape" ||
            e.key === "Control" ||
            e.key === "Shift" ||
            e.key === "Enter" ||
            e.key === "Alt" ||
            e.key === "Meta" ||
            e.key === "Alt"
        ) return;

        if (e.key === "Dead") {
            setDeadWasLastPressed(true);
            return;
        }

        if (e.key === "ArrowUp") {
            const upIndex = findNextInCol(currentPos, false);
            setSelectedCell(upIndex);
            return;
        }
        if (e.key === "ArrowDown") {
            const downIndex = findNextInCol(currentPos, true)
            setSelectedCell(downIndex);
            return;
        }
        if (e.key === "ArrowLeft") {
            const leftIndex = findNextInRow(currentPos, false)
            setSelectedCell(leftIndex);
            return;
        }
        if (e.key === "ArrowRight") {
            const rightIndex = findNextInRow(currentPos, true);
            setSelectedCell(rightIndex);
            return
        }

        if (e.key === "Tab") {
            e.preventDefault();

            let nextIndex: number | null = null;

            if (highlightDirection === 'row') {
                nextIndex = findNextInRowTab(currentPos, !e.shiftKey);
            } else {
                nextIndex = findNextInColTab(currentPos, !e.shiftKey);
            }

            setSelectedCell(nextIndex);
            inputRefs.current[nextIndex]?.focus();
            return;
        }
        else if (e.key === " ") {
            e.preventDefault();

            const nextHighlightDirection = highlightDirection === 'row' ? 'col' : 'row';
            setHighlightDirection(nextHighlightDirection);
            return
        }
        else if (e.key === "Backspace") {
            const newBoard = [...board];
            newBoard[index].value = "";
            setBoard(newBoard);
            const currentPos = getRowCol(index);
            const nextTile = highlightDirection === 'row'
                ? findNextInRow(currentPos, false)
                : findNextInCol(currentPos, false);
            console.log("Next pos is ", nextTile);
            setSelectedCell(nextTile);
        }
        else {
            const newBoard = [...board];
            let pressedKey: string = e.key.toLocaleUpperCase();

            if (deadWasLastPressed) {
                setDeadWasLastPressed(false);
                pressedKey = deadVersion[pressedKey] ?? pressedKey;
            }


            newBoard[index].value = pressedKey;
            setBoard(newBoard);
            const nextTile = highlightDirection === 'row'
                ? findNextInRow(currentPos, true)
                : findNextInCol(currentPos, true);
            console.log("Next pos is ", nextTile);
            setSelectedCell(nextTile);

        }
    };

    type keyPressed = (key: string) => void
    const handleOnScreenKeyboard: keyPressed = (key: string): void => {
        const newBoard = [...board];
        let pressedKey: string = key.toLocaleUpperCase();

        if (deadWasLastPressed) {
            setDeadWasLastPressed(false);
            pressedKey = deadVersion[pressedKey] ?? pressedKey;
        }

        let nonNullSelectedCell = selectedCell ?? 0;
        const currentPos = getRowCol(nonNullSelectedCell)

        newBoard[nonNullSelectedCell].value = pressedKey;
        setBoard(newBoard);
        const nextTile = highlightDirection === 'row'
            ? findNextInRow(currentPos, true)
            : findNextInCol(currentPos, true);
        console.log("Next pos is ", nextTile);
        setSelectedCell(nextTile);
    }

    const deadVersion: Record<string, string> = {
        A: 'Á',
        E: 'É',
        I: 'Í',
        O: 'Ó',
        U: 'Ú',
        Y: 'Ý'
    }

    const shouldHighlight = (index: number): boolean => {
        if (selectedCell === null) return false;

        const selectedPos: RowCol = getRowCol(selectedCell);
        const currentPos: RowCol = getRowCol(index);

        if (highlightDirection === 'row') {
            return selectedPos.row === currentPos.row;
        } else {
            return selectedPos.col === currentPos.col;
        }
    }

    if (error) {
        return (<h1> Villa kom upp, reynið aftur síðar </h1>)
    }

    if (loading) {
        return (
            <Spinner></Spinner>
        )
    }

    return (
        <section className="gameSection">
            <div className="gameContainer">
                <div className="board">
                    {
                        board.map((cell: Cell, index: number) => {
                            if (cell.is_blank) { return <div key={index} className="empty"></div> }
                            return (
                                <div
                                    className={`cell`}
                                    key={index}>
                                    {/* <div className="number">{cell.x_coord + "-" + cell.y_coord}</div> */}
                                    <input
                                        className={`unselectable ${shouldHighlight(index) ? "highlight" : ""}`}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength={1}
                                        value={cell.value}
                                        onClick={() => handleClick(index)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}>
                                    </input>
                                </div>

                            )
                        })
                    }
                </div>
            </div>


            <HintContainer hint={
                highlightDirection === 'row' ? horizontalHints[getHighlightedHintIndex(selectedCell ?? 0, highlightDirection)].text : verticalHints[getHighlightedHintIndex(selectedCell ?? 0, highlightDirection)].text
            }></HintContainer>
            <Keyboard keyPressed={handleOnScreenKeyboard}></Keyboard>
        </section >
    );
}

