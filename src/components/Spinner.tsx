export default function Spinner() {
    return (

        <div className="lds-grid">
            {
                Array.from({length:9}, (index)=> index)
                     .map((_, index) => {
                        return (<div key={index}> </div>);
                     })
            }
        </div>
    )
}




