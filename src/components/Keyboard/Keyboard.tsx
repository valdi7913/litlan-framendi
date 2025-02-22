import './Keyboard.css'
export function Keyboard() {
    const keys = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ð', 'ö'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'æ', '´'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'þ'],
    ]

    return (
        <div className="keyboard">
            {keys.map((row, i) => (
                <div key={i} className="row">
                    {row.map((key) => (
                        <button key={key} className="key">{key}</button>
                    ))}
                </div>
            ))}
        </div>
    )
}