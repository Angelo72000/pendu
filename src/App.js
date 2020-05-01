import React, {Component} from 'react';
import keydown from 'react-keydown';
import KeyBoard from './KeyBoard';

import './App.css';
import pendu0 from './img/pendu0.png';
import pendu1 from './img/pendu1.png';
import pendu2 from './img/pendu2.png';
import pendu3 from './img/pendu3.png';
import pendu4 from './img/pendu4.png';

const lettersAllowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


const tabLetters = lettersAllowed.split('')
const wordsListe = ['test', 'velo', 'tralala']
const maxMissed = 4
const numberOfGames = 0
const allowedInput = [
  {id : 65, name : 'A'},
  {id : 66, name : 'B'},
  {id : 67, name : 'C'},
  {id : 68, name : 'D'},
  {id : 69, name : 'E'},
  {id : 70, name : 'F'},
  {id : 71, name : 'G'},
  {id : 72, name : 'H'},
  {id : 73, name : 'I'},
  {id : 74, name : 'J'},
  {id : 75, name : 'K'},
  {id : 76, name : 'L'},
  {id : 77, name : 'M'},
  {id : 78, name : 'N'},
  {id : 79, name : 'O'},
  {id : 80, name : 'P'},
  {id : 81, name : 'Q'},
  {id : 82, name : 'R'},
  {id : 83, name : 'S'},
  {id : 84, name : 'T'},
  {id : 85, name : 'U'},
  {id : 86, name : 'V'},
  {id : 87, name : 'W'},
  {id : 88, name : 'X'},
  {id : 89, name : 'Y'},
  {id : 90, name : 'Z'},
  {id : 13, name : 'enter'},
  {id : 27, name : 'escape'},
  ]

class App extends Component{
  constructor(props){
    super(props)
    this.numberOfGames = numberOfGames
    this.gameInProgress = true
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      searchedWord : '',
      lettersToFind : [],
      matchedLetters : [],
      unmatchedLetters : [],
      score : 0,
      missed : 0,
      currentKey: '',
    }
  }

  handleKeyPress(e) {
    const { matchedLetters, unmatchedLetters, lettersToFind, missed, score } = this.state
    const newScore = (( matchedLetters.length + 1 ) === lettersToFind.length ) ? score + 1 : score 
    const pressedKey = e.key.toUpperCase()


       allowedInput.map((props) =>{
        if((e.keyCode === props.id)){

          if ((props.name === 'enter') || (props.name === 'escape') && !this.gameInProgress) {
            this.gameInProgress = true
            this.newGame()
            return 
          }
          
    
    
          // si une partie est en cours
          if (this.gameInProgress) {
            
            // si le tableau de lettre à trouver contient la lettre saisie
            if(lettersToFind.includes(pressedKey)){
              matchedLetters.push(pressedKey)
              this.setState({ 
                matchedLetters : matchedLetters,
                score : newScore,
                currentKey: pressedKey,
              })
              
              return
              
              // si la lettre saisie n'est ni dans le tableau de lettres à trouver 
              // ni dans le tableau de lettres déjà saisie 
            }else{
              
              if(!matchedLetters.includes(pressedKey) && !unmatchedLetters.includes(pressedKey) && (e.keyCode != 13)){
                unmatchedLetters.push(pressedKey)
                this.setState({ 
                  unmatchedLetters : unmatchedLetters, 
                  missed : missed + 1,
                  score : newScore,
                  currentKey: pressedKey,
                })
              }
            }             
          }



        }
      })    

  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  updateImageSrc(missed){
    switch (missed) {
      case 1: return pendu1
        break;
      case 2: return pendu2
        break;
      case 3: return pendu3
        break;
      case 4: return pendu4
        break;
      default: return pendu0
        break;
    }
  }

  selectRandomWord(){
    const newWord = wordsListe[Math.floor(Math.random()*wordsListe.length)]
    const searchedWord = newWord.toUpperCase().slice()
    return searchedWord
  }

  tabLettersToFindInWordSelected(searchedWord){
    const lettersToFind = new Set(searchedWord)
    const arrayUniqueLetters = [...lettersToFind] 
    return arrayUniqueLetters
  }

  getFeedbackForLetter(letter) {
    const { matchedLetters, unmatchedLetters } = this.state

    if(matchedLetters.includes(letter)){
      return 'letterMatched'

    }else if(unmatchedLetters.includes(letter)){
      return 'letterUnmatched'
    }
  }
  
  letterClick = letter => {
    const { matchedLetters, unmatchedLetters, lettersToFind, missed, score } = this.state
    const newScore = (( matchedLetters.length + 1 ) === lettersToFind.length ) ? score + 1 : score 

    if(lettersToFind.includes(letter)){
      matchedLetters.push(letter)
      this.setState({ 
        matchedLetters : matchedLetters,
        score : newScore,
      })
      return

    }else{
      if(!matchedLetters.includes(letter) && !unmatchedLetters.includes(letter)){
        unmatchedLetters.push(letter)
        this.setState({ 
          unmatchedLetters : unmatchedLetters, 
          missed : missed + 1,
          score : newScore,
        })
      }
    }
  }

  computeDisplay(phrase, matchedLetters, missed ) {     
    if (missed < maxMissed) {
      return phrase.replace(/\w/g,  (letter) => (matchedLetters.includes(letter) ? letter : '_'))
    }
  }

  newGame(){
    this.gameInProgress = true
    const searchedWord = this.selectRandomWord()
    const lettersToFind = this.tabLettersToFindInWordSelected(searchedWord)
    this.numberOfGames = this.numberOfGames + 1
    this.setState({
      searchedWord : searchedWord,
      lettersToFind : lettersToFind,
      unmatchedLetters: [],
      matchedLetters : [],
      missed : 0,       
    })
  }

  statusGame(){
    const { matchedLetters, missed, searchedWord, lettersToFind } = this.state

    const newGameButton = (
      <button className="btn btn-primary btn-lg" onClick={()=>this.newGame()}>
        Nouvelle partie ou appuie sur 'Entrer'
      </button>
    )

    const win = (
      <div>
        <h2>Gagné !!!!</h2>
        <p>Vous remportez la partie avec seulement <strong>{missed} erreur(s)</strong></p>
        {newGameButton}
      </div>
    )

    const loose = (
      <div>
        <h2>Perdu !!!!</h2>
        <p>Le mot recherché était <strong>{searchedWord}</strong></p>
        {newGameButton}
      </div>      
    )    

    if ((matchedLetters.length === lettersToFind.length) && searchedWord !='') {
      this.gameInProgress = false
      return win
    }
    
    if ( missed > maxMissed - 1) {
      this.gameInProgress = false
      return loose
    }
  }

  render(){
    const { searchedWord, matchedLetters, missed, score } = this.state
    const displayWord = this.computeDisplay( searchedWord, matchedLetters, missed )
    const imageName = this.updateImageSrc( missed )

    const displayScore = (!this.gameInProgress) ? (<span>Partie en cours !</span>) : ( <span>score : {score} / {this.numberOfGames}</span> )

    if(this.numberOfGames === 0){
      this.newGame(wordsListe)
    } 
    return(
      <div>
          <div className="col-md-7  mx-auto text-center">
            {/* <div>Mot à trouver {searchedWord} { this.displayScore()  }</div> */}
            <div>{ displayScore  }</div>
          </div>

          <div className="col-md-7  mx-auto text-center">
            <section className="jumbotron text-center">
              <div className="container">
                <img src={ imageName } alt="Pendu" className="pendu" />
                <h1 className="jumbotron-heading">{ displayWord }</h1>
                <div>{ this.statusGame()  }</div>
              </div>
            </section>
          </div>
            
          <div className="col-md-7  mx-auto text-center">
            { 
              tabLetters.map((letter, index) => (
                <KeyBoard
                  letter={letter}
                  feedback={this.getFeedbackForLetter(letter)}
                  key={index}
                  onClick={this.letterClick}
                />
              ))
            }
          </div>
      </div>
      
    )
  }
}

export default App;
