import React, { Component } from 'react';
import KeyBoard from './KeyBoard';
import pendu0 from './img/pendu0.png';
import pendu1 from './img/pendu1.png';
import pendu2 from './img/pendu2.png';
import pendu3 from './img/pendu3.png';
import pendu4 from './img/pendu4.png';
import './App.css';

const letters_ok ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const letters = letters_ok.split('')
const word = ['cheval', 'velo', 'tartiflette']
const nbChance = 4

class App extends Component{

  constructor(props) {
    super(props)
    this.state = {
      wordToFind : this.randomWord(),
      unmatchedLetters: [],
      matchedLetters : [],
      guesses : 0,
      score : 0, 
      gamePlayed : 0,    
    }
  }
  
  randomWord(){
    const newWord = word[Math.floor(Math.random()*word.length)]
    const wordToFind = newWord.toUpperCase().slice()
    return wordToFind
  }

  lettersToFind(){
    const { wordToFind } = this.state
    const lettersToFind = new Set(wordToFind)
    const arrayUniqueLetters = [...lettersToFind] 
    return arrayUniqueLetters
  }

  handleLetterClick = letter => {
    const { matchedLetters, unmatchedLetters, guesses, score } = this.state
    const lettersToFind = this.lettersToFind()

    const newScore = (( matchedLetters.length + 1 ) === lettersToFind.length ) ? score + 1 : score 

    
    this.setState({ 
      score : newScore,
    })

    if(lettersToFind.includes(letter)){
      matchedLetters.push(letter)
      this.setState({ matchedLetters : matchedLetters })
      return

    }else{
      if(!matchedLetters.includes(letter) || !unmatchedLetters.includes(letter)){
        unmatchedLetters.push(letter)
        this.setState({ unmatchedLetters : unmatchedLetters, guesses : guesses + 1 })
      }
      return
    }
  }

  getFeedbackForLetter(letter) {
    const { matchedLetters, unmatchedLetters } = this.state

    if(matchedLetters.includes(letter)){
      return 'letterMatched'

    }else if(unmatchedLetters.includes(letter)){
      return 'letterUnmatched'
    }

    return 'unTested'
  }

  computeDisplay(phrase, matchedLetters, guesses ) {     
    if (guesses < nbChance) {
      return phrase.replace(/\w/g,    (letter) => (matchedLetters.includes(letter) ? letter : '_'))
    }
  }

  imageSource(guesses){
    switch (guesses) {
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

  reinitGame(){
    this.setState({
      wordToFind : this.randomWord(),
      unmatchedLetters: [],
      matchedLetters : [],
      guesses : 0,         
    })
  }

  etatJeux(){
    const { matchedLetters, guesses, wordToFind } = this.state
    const newGameButton = (
      <button className="btn btn-primary btn-lg" onClick={()=>this.reinitGame()}>
        Nouvelle partie 
      </button>
    )

    if (matchedLetters.length === this.lettersToFind().length) {
      return (
        <div>
          <h2>Gagné !!!!</h2>
          <p>Vous remportez la partie avec seulement <strong>{guesses} erreur(s)</strong></p>
          {newGameButton}
        </div>
      )
    }
    
    if ( guesses > nbChance - 1) {
      return (
        <div>
          <h2>Perdu !!!!</h2>
          <p>Le mot recherché était <strong>{wordToFind}</strong></p>
          {newGameButton}
        </div>
      )
    }
  }


  gameScore(){
      const { score, gamePlayed } = this.state
      return ( <span>score : {score} / {gamePlayed}</span> )
  }

  render(){
    const { wordToFind, matchedLetters, guesses } = this.state
    const displayWord = this.computeDisplay( wordToFind, matchedLetters, guesses )
    const imageName = this.imageSource( guesses )

    return(
      <div>
        <div className="col-md-8  mx-auto text-center">
          <section className="jumbotron text-center">
            <div>{ this.gameScore()  }</div>
            <div className="container">
              <img src={ imageName } alt="Pendu" className="pendu" />
              <h1 className="jumbotron-heading">{ displayWord }</h1>
              <div>{ this.etatJeux()  }</div>
            </div>
          </section>
        </div>
        <div className="col-md-8  mx-auto text-center">
          { 
            letters.map((letter, index) => (
              <KeyBoard
                letter={letter}
                feedback={this.getFeedbackForLetter(letter)}
                key={index}
                onClick={this.handleLetterClick}
              />
            ))
          }
        </div>
      </div>
    )

  }

}

export default App;
