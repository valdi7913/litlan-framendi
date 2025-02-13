import "./Header.css"; // Import the CSS file

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="title">Litlan</h1>
                <div className="button-container">
                    <button className="circle-button">?</button>
                    <button className="circle-button">?</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
