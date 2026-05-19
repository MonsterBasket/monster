import { useEffect, useRef } from "react"

  export default function Title(){
    const a = "MONSTER"
    const b = "BASKET"
    const textBox = useRef();
    const textRect = useRef();
    let j = a.length + b.length

    function myMap(arr){
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === " ") newArr.push(<span key={i}>&nbsp;</span>)
        else newArr.push(<span key={i} style={{"--d":`-${j--}s`}}>{arr[i]}</span>)
      }
      return newArr.map(l => l)
    }

    const text = <>
      <p>{myMap(a)}</p>
      <p>{myMap(b)}</p>
    </>

    function resize(){
      textRect.current = textBox.current.getBoundingClientRect()
    }
    useEffect(() => resize(),[])
  
    function getCoords(e){
      textBox.current.style.setProperty('--x', e.clientX - textRect.current.left + 'px');
      textBox.current.style.setProperty('--y', e.clientY - textRect.current.top + 'px');
    }
  
    useEffect(() =>{
      window.addEventListener("mousemove", getCoords, false)
      window.addEventListener('scroll', resize) 
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener("mousemove", getCoords, false)
        window.removeEventListener('resize', resize);
      }
    })
    
    return <div className="titleText">
      <div className="tt1">
        {text}
      </div>
      <div ref={textBox} className="tt2">
        {text}
      </div>
    </div>
  }