import React, {Component} from 'react';
import KeyBoard from './KeyBoard';
import DisplayGame from './DisplayGame';
import WordsList from './WordsList';

import './App.css';

const lettersAllowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const tabLetters = lettersAllowed.split('')
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

  // Choix d'un mot au hasard dans la liste de mots
  selectRandomWord(){
    const newWord = WordsList[Math.floor(Math.random()*WordsList.length)]
    const searchedWord = newWord.toUpperCase().slice()
    return searchedWord
  }

  // Gération d'un tableau de letters uniques à trouver dans le mot tiré au sort
  tabLettersToFindInWordSelected(searchedWord){
    const lettersToFind = new Set(searchedWord)
    const arrayUniqueLetters = [...lettersToFind] 
    return arrayUniqueLetters
  }

  // Ajout du écouteur dévènement keydown
  componentDidMount() {
    document.addEventListener('keydown', this.pressKey);
  }
  
  // Suppression de l'écouteur dévènement keydown  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.pressKey);
  }

  // GESTION DE LA PARTIE AVEC LE CLAVIER
  // Méthode déclarée avec une fonction fléchée pour garantir le this
  pressKey = (e) => {
    const { matchedLetters, unmatchedLetters, lettersToFind, missed, score } = this.state
    const newScore = (( matchedLetters.length + 1 ) === lettersToFind.length ) ? score + 1 : score 
    const pressedKey = e.key.toUpperCase()

    
    // on vérifie si ID de la touche saisie correspond à l'un des ID de touche autorisé
    allowedInput.map((props) =>{
      if((e.keyCode === props.id)){
  
        const pressEscapeOrEnter = ((props.name === 'enter') || (props.name === 'escape'))?true:false

          // Si la partie est terminée et 'Entrer' ou 'Echape' on relance une game
          if (pressEscapeOrEnter && !this.gameInProgress) {
            this.gameInProgress = true
            this.newGame()
            return 
          }
          
          // On vérifie si la partie est toujours en cours et si le tableau de lettre à trouver contient la lettre saisie et on met à jour l'état du jeu
          if (this.gameInProgress && !pressEscapeOrEnter) {
            if(lettersToFind.includes(pressedKey)){
              matchedLetters.push(pressedKey) 
              this.setState({ 
                matchedLetters : matchedLetters,
                score : newScore,
                currentKey: pressedKey,
              })
              return
              
            }else{
              // si la lettre saisie n'est ni dans le tableau de lettres à trouver ni dans le tableau de lettres déjà saisie 
              if(!matchedLetters.includes(pressedKey) && !unmatchedLetters.includes(pressedKey) && !pressEscapeOrEnter){
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
      })// Fin de map allowedInput

  }
  
  // GESTION DE LA PARTIE À LA SOURIE
  letterClick = letter => {
    const { matchedLetters, unmatchedLetters, lettersToFind, missed, score } = this.state
    const newScore = (( matchedLetters.length + 1 ) === lettersToFind.length ) ? score + 1 : score 
    this.gameInProgress = true
    
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

  // gestion du Feedback des Boutons touches en fonction des lettres déjà trouvées ou pas
  getFeedbackForLetter(letter) {
    const { matchedLetters, unmatchedLetters } = this.state

    if(matchedLetters.includes(letter)){
      return 'letterMatched'

    }else if(unmatchedLetters.includes(letter)){
      return 'letterUnmatched'
    }
  }
  
  // Initialisation d'une nouvelle partie + update manche 
  newGame = () => {
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

  // Vérifie si la partie est gagnée ou perdu 
  statusGame(){
    const { matchedLetters, missed, searchedWord, lettersToFind } = this.state

    if ((matchedLetters.length === lettersToFind.length) && searchedWord !='') {
      this.gameInProgress = false
      return 'win'
    }
    
    if ( missed > maxMissed - 1) {
      this.gameInProgress = false
      return 'loose'
    }
  }

  render(){
    const { searchedWord, matchedLetters, missed, score } = this.state

    if(this.numberOfGames === 0){
      this.newGame()
    } 
    return(
      <div>
          <DisplayGame missed={missed} 
                       searchedWord={searchedWord}
                       matchedLetters={matchedLetters}
                       maxMissed={maxMissed}
                       statusGame={this.statusGame()}
                       onClick={this.newGame}
                       score={score}
                       numberOfGames={this.numberOfGames}
          />


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
