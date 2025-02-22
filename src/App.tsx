import './App.css'
import Crossword from './components/Crossword/Crossword';
import Header from './components/Header/Header';
import { Keyboard } from './components/Keyboard/Keyboard';

function App() {
  return (
    <>
      <Header></Header>
      <Crossword></Crossword>
      <Keyboard></Keyboard>
    </>
  )
}

export default App;
