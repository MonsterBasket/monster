import { Route, Routes } from "react-router-dom";
import './App.css';
import Portfolio from './portfolio/App.tsx';
import PlayOld from './old_game/App.js';
import Main from './components/main.js';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/play-old" element={<PlayOld />} />
          <Route path="/" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
