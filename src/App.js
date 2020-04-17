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

class App extends Component{
  state = {
    wordToFind : this.randomWord(),
    unmatchedLetters: [],
    matchedLetters : [],
    guesses : 0,
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
    const { matchedLetters, unmatchedLetters, guesses } = this.state
    const lettersToFind = this.lettersToFind()
    console.log(!matchedLetters.includes(letter))
    
    if( lettersToFind.length === matchedLetters.length ){
      console.log('Win !!!')
      return
    }

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


  computeDisplay(phrase, matchedLetters) {
    return phrase.replace(/\w/g,    (letter) => (matchedLetters.includes(letter) ? letter : '_'))
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

  etatJeux(){
    const { matchedLetters, guesses } = this.state

    if (matchedLetters.length === this.lettersToFind().length) {
      return <span>Gagné !!!!</span>
    }
    
    if ( guesses > 3) {
      return  <span>Perdu !!!!</span>
    }
  }

  render(){
    const {wordToFind, matchedLetters, guesses } = this.state
    const displayWord = this.computeDisplay(wordToFind, matchedLetters)
    const imageName = this.imageSource( guesses )

    return(
      <div>
        <div className="col-md-8  mx-auto text-center">
          <section className="jumbotron text-center">
            <div className="container">
              <img src={ imageName } alt="Pendu" className="pendu" />
              <h1 className="jumbotron-heading">{ displayWord }</h1>
              <p>{ this.etatJeux()  }</p>


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
