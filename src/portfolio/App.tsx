import { useState } from 'react';
import './components/CSS/App.css';
import Splash from './components/Splash.tsx'
import About from './components/About.tsx';
import Animation from './components/Animation.tsx'
import Contact from './components/Contact.tsx';
import Hello from './components/Hello.tsx';
import Menu from './components/Menu.tsx';
import Projects from './components/Projects.tsx';
import Tabs from './components/Tabs.tsx';

function App() {

  const [buttonWidth, setButtonWidth] = useState<number>(window.innerWidth > 500 ? 100 : window.innerWidth / 5)
  const [buttonOpacity, setButtonOpacity] = useState<number>(1)
  const [turnToCheat, setTurnToCheat] = useState<number>(0)

  return (
    <div className="App">
      <Splash>
        <Hello />
        <Tabs buttonWidth={buttonWidth} buttonOpacity={buttonOpacity} turnToCheat={turnToCheat} setTurnToCheat={setTurnToCheat} names={["About", "Projects", "Work", "Contact"]}>
          <Contact turnToCheat={turnToCheat} />
          <Projects turnToCheat={turnToCheat} />
          <Animation turnToCheat={turnToCheat} />
          <About turnToCheat={turnToCheat} />
        </Tabs>

        <Menu buttonWidth={buttonWidth} setButtonWidth={setButtonWidth} buttonOpacity={buttonOpacity} setButtonOpacity={setButtonOpacity} setTurnToCheat={setTurnToCheat}/>
      </Splash>
    </div>
  );
}

export default App;
