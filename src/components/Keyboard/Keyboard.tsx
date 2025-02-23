import { useState } from 'react';
import './Keyboard.css'

type keyPressed = (key: string) => void

export function Keyboard({ keyPressed }: { keyPressed: keyPressed }) {
    const [deadWasLastPressed, setDeadWasLastPressed] = useState<boolean>(false);
    const keys = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ð'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'æ', '´'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'þ', 'enter'],
    ]

    const altKeys = [
        ['é', ' ', ' ', 'ý', 'ú', 'í', 'ó', ' ', 'ð', 'ö'],
        ['á', ' ', ' ', ' ', ' ', ' ', '', '', ' ', ' ', ' '],
        ['', '', '', '', '', ''],
    ]

    const handleClick = (key: string) => {
        console.log(key, key === '´');

        if (key === '´') {
            console.log("dead key");
            setDeadWasLastPressed(true);
        }
        else if (key === 'enter') {
            console.log("enter");
        }
        else {
            keyPressed(key);
            setDeadWasLastPressed(false);
        }
    }

    if (deadWasLastPressed) {
        return (
            <div className="keyboard">
                {altKeys.map((row, i) => (
                    <div key={i} className="row">
                        {row.map((key) => (
                            <button className="key" key={key} onClick={(e) => { e.preventDefault(); handleClick(key); }}>{key}</button>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="keyboard">
            {keys.map((row, i) => (
                <div key={i} className="row">
                    {row.map((key) => (
                        <button className="key" key={key} onClick={(e) => { e.preventDefault(); handleClick(key); }}>{key}</button>
                    ))}
                </div>
            ))}
        </div>
    )
}