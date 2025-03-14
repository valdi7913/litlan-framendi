import { useState } from 'react';
import './Keyboard.css'
import {
    FaDeleteLeft,
} from "react-icons/fa6";

type keyPressed = (key: string) => void

export function Keyboard({ keyPressed }: { keyPressed: keyPressed }) {
    const defaultKeys = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ð', 'delete'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'æ', '´'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'þ', 'enter'],
    ]

    const altKeys = [
        [' ', ' ', 'é', ' ', ' ', 'ý', 'ú', 'í', 'ó', ' ', 'ð', 'ö'],
        ['á', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'enter'],
    ]

    const [keys, setKeys] = useState<string[][]>(defaultKeys);
    const handleClick = (key: string) => {
        if (key === '´') {
            console.log("dead key");
            setKeys(altKeys);
        }
        else if (key === 'delete') { }
        else if (key === 'enter') {
            console.log("enter");
        }
        else if (key === ' ') {
            setKeys(defaultKeys);
        }
        else {
            keyPressed(key);
            setKeys(defaultKeys);
        }
    }
    return (
        <div className="keyboard">
            {(keys).map((row, i) => (
                <div key={"row" + i} className="row">
                    {row.map((key) => {
                        if (key === "enter") {
                            return (
                                <button
                                    className="key enter"
                                    key={i + key}
                                    onClick={() => { handleClick(key); }}>
                                    {"Enter"}
                                </button>
                            )
                        }
                        if (key === 'delete') {
                            return (
                                <button
                                    className="key"
                                    key={i}
                                    onClick={() => { handleClick(key); }}>
                                    <FaDeleteLeft />
                                </button>
                            )
                        }
                        return (
                            <button
                                className="key"
                                key={i}
                                onClick={() => { handleClick(key); }}
                            >
                                {key}
                            </button>
                        )
                    })}
                </div>
            ))
            }
        </div >
    )
}