import React, {Component} from 'react';
import KeyBoard from './KeyBoard';
// import DisplayGame from './DisplayGame';
import DisplayGameApp from './DisplayGameApp';
import { lettersAllowed, WordsList, allowedInput } from './Settings';

import './App.css';

const tabLetters = lettersAllowed.split('')
const maxMissed = 4
const loop = 0


class App extends Component{
  constructor(props){
    super(props)
    this.loop = loop
    this.gameInProgress = true
    this.state = {
      showingAlert: false,
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

  isAlreadyUsedLetter(matchedLetters, unmatchedLetters, letter){
    if (matchedLetters.includes(letter) || unmatchedLetters.includes(letter)){
      this.setState({
        showingAlert: true
      });
      
      setTimeout(() => {
        this.setState({
          showingAlert: false
        });
      }, 2000)
      return true 
    }
    return false 
  }

  // GESTION DE LA PARTIE AVEC LE CLAVIER
  // Méthode déclarée avec une fonction fléchée pour garantir le this
  pressKey = (e) => {
    const { matchedLetters, unmatchedLetters, lettersToFind, missed, score } = this.state
    const newScore = (( matchedLetters.length + 1 ) === lettersToFind.length ) ? score + 1 : score 
    const pressedKey = e.key.toUpperCase()
    const letterAlreadyUsed =  this.isAlreadyUsedLetter(matchedLetters, unmatchedLetters, pressedKey)

    // on vérifie si ID de la touche saisie correspond à l'un des ID de touche autorisé
    allowedInput.map((props) =>{
      if((e.keyCode === props.id)){
  
        const pressEscapeOrEnter = ((props.name === 'enter') || (props.name === 'escape'))?true:false

        // Si la partie est terminée et 'Entrer' ou 'Echape' on relance une game
        if (pressEscapeOrEnter && !this.gameInProgress) {
          this.gameInProgress = true
          this.newGame()
        }
        
        // On vérifie si la partie est toujours en cours et si le tableau de lettre à trouver contient la lettre saisie et on met à jour l'état du jeu
        if (this.gameInProgress && !pressEscapeOrEnter) {
          if(lettersToFind.includes(pressedKey) && !letterAlreadyUsed){
            matchedLetters.push(pressedKey) 
            this.setState({ 
              matchedLetters : matchedLetters,
              score : newScore,
              currentKey: pressedKey,
            })
            
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
      return false // Ne retourne rien
    })// Fin de map allowedInput

  }
  
  // GESTION DE LA PARTIE À LA SOURIE
  letterClick = letter => {
    const { matchedLetters, unmatchedLetters, lettersToFind, missed, score } = this.state
    const newScore = (( matchedLetters.length + 1 ) === lettersToFind.length ) ? score + 1 : score 
    this.gameInProgress = true
    const letterAlreadyUsed =  this.isAlreadyUsedLetter(matchedLetters, unmatchedLetters, letter)
    
    if(lettersToFind.includes(letter) && !letterAlreadyUsed){
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
    return 'unPressed'
  }
  
  // Initialisation d'une nouvelle partie + update manche 
  newGame = () => {
    this.gameInProgress = true
    const searchedWord = this.selectRandomWord()
    const lettersToFind = this.tabLettersToFindInWordSelected(searchedWord)
    this.loop = this.loop + 1
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

    if ((matchedLetters.length === lettersToFind.length) && searchedWord !=='') {
      this.gameInProgress = false
      return 'win'
    }
    
    if ( missed > maxMissed - 1) {
      this.gameInProgress = false
      return 'loose'
    }
    return 'in progress'
  }

  
  render(){
    const { searchedWord, matchedLetters, missed, score } = this.state
    const alert = (
        <div className="col-md-7  mx-auto text-center">
          <div className={`alert alert-warning ${this.state.showingAlert ? 'alert-shown' : 'alert-hidden'}`}>
            <strong>Cette lettre à déja été utilisée</strong>
          </div>          
        </div> ) 
      

    if(this.loop === 0){
      this.newGame()
    } 

    return(
      <div>
          <DisplayGameApp missed={missed} 
                          searchedWord={searchedWord}
                          matchedLetters={matchedLetters}
                          maxMissed={maxMissed}
                          statusGame={this.statusGame()}
                          onClick={this.newGame}
                          score={score}
                          loop={this.loop}
                          gameInProgress={this.gameInProgress}
          />
          {alert}
          <div className="col-12 col-sm-12 col-md-10 col-lg-9 col-xl-7 mx-auto text-center">
            {
              tabLetters.map((letter, index) => (
                <KeyBoard letter={letter}
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
