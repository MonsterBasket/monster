import { ReactElement, useEffect, useRef, useState } from "react"
import { v4 as uuid } from 'uuid';
import "./CSS/typing.css"

type Props = {
  right: string;
  left: string;
  active: boolean;
}

function Word({right, left, active}: Props) {
  let first = true
  let leftClass = left.length ? "typedLetters" : ""
  let rightClass = left.length ? "untypedLetters" : "preLetters"
  const letters = useRef<ReactElement[] | null[]>([])
  const liveWord = useRef<ReactElement | null>(<>
    <span className={leftClass}>{left}</span>
    <span className={rightClass}>{right}</span>
  </>)
  const [, rerender] = useState<string[]>([])

  const jumpH = useRef<number[]>([])
  const jumpW = useRef<number[]>([])
  interface jumpS2 {left: string, top: string, transform: string, animationDelay: string}
  interface jumpS { [index: number]: jumpS2}
  const jumpS = useRef<jumpS>([])
  const [jumpK, setJumpK] = useState<string[]>([])


  useEffect(() => {
    if (first){
      first = false
    }
    else if (leftClass === ""){
      leftClass = "typedLetters"
      rightClass = "untypedLetters"
    }
    if (right === "") explode()
    rerender([])
  }, [right])

  function explode() {
    const word = left + right
    //right = ""
    left = ""

    for (let i = 0; i < word.length; i++) {
      jumpH.current[i] = 0
      jumpW.current[i] = i / 2 + 0.2
      let newK = jumpK
      newK[i] = uuid()
      setJumpK(newK)
      jumpS.current[i] = {left:`${jumpW.current[i]}em`, top:`${jumpH.current[i]}em`, transform:"rotateZ(0deg)", animationDelay:"0ms"}
      letters.current[i] = <div key={newK[i]} style={jumpS.current[i]}>{word.charAt(i)}</div>
      const targetHeight = (-Math.abs(i / (word.length - 1) - 0.5) - 3) - (Math.random() * 2)
      const horizontalSpeed = ((i - (word.length / 2)) + (Math.random())) / 8
      jump(targetHeight, horizontalSpeed, word.charAt(i), i)
    }
    leftClass = "noLetters"
    rightClass = "noLetters"
    setTimeout(() => {
      liveWord.current = <>{letters.current.map(l => l)}</>
      rerender([])
    }, 0)
    setTimeout(() => letters.current = [], 2000)
  }

  function jump(ht:number, hs:number, letter:string, i:number, delay:number = 0, val:number = hs, vs:number = 0.2){
    if (ht < 0)
      jumpH.current[i] += (ht - jumpH.current[i]) * 0.2
    // else if (jumpH.current[i] > 30)
    //   jumpH.current[i] *= 1.1
    else {
      jumpH.current[i] += vs //(h*0.7 / (h*0.7 - jumpH.current[i])) * 0.4 // (h - jumpH.current[i]) * .1 // vertical speed, increase until target (h) reached, then decrease
      vs *= 1.1
    }
    jumpW.current[i] += hs // horizontal speed, slow degradation
    let newK = jumpK
    newK[i] = uuid()
    setJumpK(newK)
    jumpS.current[i] = {left:`${jumpW.current[i]}em`, top:`${jumpH.current[i]}em`, transform:`rotateZ(${val * 20 * -delay}deg)`, animationDelay:`${delay}ms`}
    delay -= 16
    letters.current[i] = <div key={newK[i]} style={jumpS.current[i]}>{letter}</div>
    setTimeout(() => {
      liveWord.current = <>{letters.current.map(l => l)}</>
      rerender([])
    }, 0)
    // hs *= 0.95
    if (ht < 0 && ht - jumpH.current[i] > -0.3) ht = 30
    if (ht != 30 || jumpH.current[i] < ht){
      // if (i == 1) console.log(l, jumpH.current[i])
      setTimeout((ht, hs, letter, i, delay, val, vs) => requestAnimationFrame(() => jump(ht,hs,letter,i,delay,val, vs)), 16, ht, hs, letter, i, delay, val, vs) //no performance adjustment, but eh.
    }
    else {
      letters.current[i] = null
      for (let i = 0; i < letters.current.length; i++) {
        if (letters.current[i] != null) break;
        liveWord.current = null;
      }
    }
  }
  return liveWord.current ? liveWord.current : null
}

type Props2 = {
  active: boolean;
}
export default function Typing({active}: Props2){

  let firstTime = useRef<boolean>(true);
  let target:string|null = null;
  let allWords:string[] = ['ant', 'box', 'car', 'dog', 'egg', 'fog', 'gin', 'hot', 'ice', 'jam', 'kin', 'lie', 'map', 'nil', 'off', 'pet', 'qin', 'red', 'sly', 'tee', 'urn', 'vat', 'why', 'you', 'zen',
    'atom', 'bare', 'cave', 'dire', 'epic', 'fate', 'goal', 'heat', 'iron', 'joke', 'kept', 'list', 'made', 'note', 'ouch', 'play', 'quit', 'rest', 'sell', 'told', 'unit', 'volt', 'wind', 'xray', 'yarn', 'zeus',
    'apart', 'bring', 'close', 'delve', 'ember', 'finch', 'ghost', 'heart', 'ideal', 'joint', 'knife', 'level', 'moist', 'noise', 'ounce', 'proud', 'quiet', 'rapid', 'solid', 'teach', 'under', 'voice', 'whale', 'xenon', 'yacht', 'zebra',
    'aurora', 'bright', 'create', 'docile', 'earned', 'finder', 'golden', 'honest', 'ironic', 'joking', 'knight', 'lowest', 'modest', 'novice', 'orient', 'played', 'quoted', 'reward', 'spoilt', 'taught', 'undone', 'violet', 'whisky', 'xanadu', 'yellow', 'zenith'];

  const [r,rerender] = useState<[]>([])

  interface keys2 {key: string, left: string, right: string, top: number, time: number}
  interface keysInfo { [index: string]: keys2; }
  const [keys, setKeys] = useState<keysInfo>({})
  const key = useRef<string>("")

  // interface firsts { [index: string]: string }
  // const first:firsts = {}
  //interface words { [index: string]: ReactElement }
  //const [words, setWords] = useState<words>({})

  useEffect(() => {
    window.addEventListener("keydown", typing, false)
    // return window.removeEventListener("keydown", typing, false) // matching the true/false actually breaks the event listener
    // The above should be a neccesary cleanup, but it's causing a memory leak, and works MUCH better removed.
  },[])

  useEffect(() => {
    if (firstTime.current){
      createWord()
      firstTime.current = false;
    }
  }, [])
  function createWord() { 
    let newIndex = Math.floor(Math.random() * (allWords.length - 1))
    while (allWords[newIndex].charAt(0) in keys){
      newIndex += 1
      if (newIndex === allWords.length) newIndex = 0;
    }
    const newWord:string = allWords[newIndex]
    key.current = newWord.charAt(0)
    let newKeys = keys
    newKeys[key.current] = {key: uuid(), right: newWord, left: "", top: Math.random() * 85 + 5, time: Date.now()}
    setKeys(newKeys)
    rerender([])
    // /*
    setTimeout(() => createWord(), 2000); // new word every 2 seconds
    setTimeout(function(a){
      if (a in keys) {
        if (keys[a].right === "") return
        let newKeys = keys
        newKeys[a].left += newKeys[a].right
        newKeys[a].right = ""
        newKeys[a].key = uuid()
        setKeys(newKeys)
        rerender([])

        setTimeout((a) => delete keys[a], 2000, a) // This is how long the explosion animation lasts
        if (target === a) target = null
      }
    }, 4000, newWord.charAt(0)); // destroy after 4 seconds and then remove elements after 2 seconds (setTimeout above)
    // */
  }

  function typing(e:any){
    if(e.keyCode === 32) { //spacebar - this prevents page scroll when space is pressed
      e.preventDefault();
    }
    let key:string = (() => {
        return e.key.length === 1 && e.key.match(/[a-z 0-9A-Z_-]/i) ? e.key.toLowerCase() : ''
    })()
    if (!key) return //if non-letter typed, exit function.
    if (target == null && key in keys) {  // check if any word is already targeted
      target = key
    }
    // ------- if there is still not a target word, subtract score ----------(note this is a sequential if, not an else)
    if (target == null) {
        // scoreDown() // I'll just leave this here for now
    }
    else { // --------- or if it didn't fail, start doing things
      if (key === keys[target].right.charAt(0)){
        let newKeys = keys
        newKeys[target].left += newKeys[target].right.charAt(0)
        newKeys[target].right = keys[target].right.slice(1)
        newKeys[target].key = uuid()
        setKeys(newKeys)
        rerender([])
      }
      else {
          // scoreDown();
      }
      //-----------
      if (keys[target].right === "") { //word is fully typed
        setTimeout((target) => {
          delete keys[target]
        }, 2000, target)
        target = null
        rerender([])
      }
    }
  }

  return <div className="typebg">
    {Object.keys(keys).map(k => <div key={k} className={"words move" + (keys[k].right ? "" : " paused")} style={{top:`${keys[k].top}%`}}>
      <Word key = {keys[k].key} right = {keys[k].right} left = {keys[k].left} active = {active}/>
    </div>)}
    <div className="typebgside"/>
  </div>
}