import React, { useEffect, useState } from "react"

type Props = {
  buttonWidth: number;
  buttonOpacity: number;
  turnToCheat: number;
  setTurnToCheat: (val: number) => void;
  names: string[];
  children: React.ReactElement|React.ReactElement[]
}

export default function Tabs({buttonWidth, buttonOpacity, turnToCheat, setTurnToCheat, names, children}: Props) {

  buttonWidth *= 1.35;
  let tabMorph:number = -Math.min(Math.max(1.5 - buttonOpacity -1, 0), 1);
  const [tab, setTab] = useState<string[]>(["Front", "2", "1", "0"])
  const kids = React.Children.toArray(children);

  useEffect(() => turnTo(turnToCheat), [turnToCheat]);


  function turnTo(page:number){
    document.documentElement.scrollTo(0, document.documentElement.scrollHeight)
    let quickTurn:boolean = false;
    if (page >= 10){
      page -= 10
      quickTurn = true;
      //skip animation and just change z index?
    }
    setTurnToCheat(page)
    if (tab[page] != "Front"){ //clicking on front tab does nothing
      let temptab:string[] = tab;
      for (let i = 0; i < 4; i++) {
        if (temptab[i] != "Up" && temptab[i] != "Front" && parseInt(temptab[i]) > parseInt(temptab[page])){
          let tempnum:number = parseInt(temptab[i]) - 1
          temptab[i] = tempnum.toString()
        }
        else if (temptab[i] == "Front"){
          temptab[i] = "2"
        }
      }
      if (quickTurn){
        temptab[page] = "Front"
        setTab([...temptab])
      }
      else{
        temptab[page] = "Up"
        setTab([...temptab]) //spread array to force re-render
        setTimeout(() => {
          temptab[page] = "Front"
          setTab([...temptab])
        }, 300)
      }
    }
  }

  // The transition doesn't currently work amazingly well on phones.  Looks fine before and after, but doesn't line up during.
  return (
    <div id="tabSection">
      <div className="tabTopBack" style={{opacity:`${1 - buttonOpacity}`}}></div>
      <div className="tabHolder">
        <div className={`tab tab${tab[0]}`} id="tab0" >
          <div className="tabTop tabTop0" onClick={() => turnTo(0)} style={{left: `${15 - (buttonWidth * 0.12)}px`, width:`${buttonWidth}px`, opacity:`${buttonOpacity < 1 ? 1 : 0}`, animationDelay:`${tabMorph}s`}}>{names[0]}</div>
          {kids[0]}
        </div>      
        <div className={`tab tab${tab[1]}`} id="tab1" >
          <div className="tabTop tabTop1" onClick={() => turnTo(1)} style={{left: `${((buttonWidth / 1.35) + 24) - (buttonWidth * 0.12)}px`, width:`${buttonWidth}px`, opacity:`${buttonOpacity < 1 ? 1 : 0}`, animationDelay:`${tabMorph}s`}}>{names[1]}</div>
          {kids[1]}
        </div>      
        <div className={`tab tab${tab[2]}`} id="tab2" >
          <div className="tabTop tabTop2" onClick={() => turnTo(2)} style={{left: `${(buttonWidth / 1.35) * 2 + 32.5 - (buttonWidth * 0.12)}px`, width:`${buttonWidth}px`, opacity:`${buttonOpacity < 1 ? 1 : 0}`, animationDelay:`${tabMorph}s`}}>{names[2]}</div>
          {kids[2]}
        </div>      
        <div className={`tab tab${tab[3]}`} id="tab3" >
          <div className="tabTop tabTop3" onClick={() => turnTo(3)} style={{left: `${(buttonWidth / 1.35) * 3 + 40 - (buttonWidth * 0.12)}px`, width:`${buttonWidth}px`, opacity:`${buttonOpacity < 1 ? 1 : 0}`, animationDelay:`${tabMorph}s`}}>{names[3]}</div>
          {kids[3]}
        </div>
      </div>
    </div>
  );
}