import './title.css';

function Title({ size }: { size: number }){
  let text = "Monster Basket"

  if(window.screen.availHeight < 600) size = 2;

  const shrink = {
    fontSize: `${window.screen.availHeight < 600 || window.screen.availWidth < 600 ? size : size * 2.5}em`,
    margin: window.screen.availHeight < 600 || window.screen.availWidth < 600 ? "auto" : "revert"
  }

  function createHeader(word: string){
    const myString = [];
    if(window.screen.availHeight < 600 || window.screen.availWidth < 600) size = size / 2;
    for (let i = 0; i < word.length; i++) {
      if(word[i] == " ") myString[i] = " "
      else myString[i] = <div key={`titleLetter${i}`} className="letterHolder"
        style={{top: Math.abs(word.length / 2 - i - 1) * Math.abs(word.length / 2 - i - 1) * size,
               left: (word.length / 2 - i - 1) * size * 2,
                transform: `rotate(${(word.length / 2 - i - 1) * -0.01}turn)`}}>
        <span className="bouncyLetter spin">{word[i]}</span>
      </div>
    }
    return myString;
  }

  return <h1 style={shrink}>
    {createHeader(text)}
    </h1>
}

export default Title;