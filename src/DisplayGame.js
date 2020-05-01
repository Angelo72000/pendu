import React from 'react'
// import PropTypes from 'prop-types'

import pendu0 from './img/pendu0.png';
import pendu1 from './img/pendu1.png';
import pendu2 from './img/pendu2.png';
import pendu3 from './img/pendu3.png';
import pendu4 from './img/pendu4.png';

 
function updateImageSrc(missed){
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

function displayWinOrLoose(missed,searchedWord,statusGame, onClick){

    const newGameButton = (
      <button className="btn btn-primary btn-lg" onClick={() => onClick()}>
        Continuer
      </button>
    )

    const win = (
      <div>
        <h2>Gagné !!!!</h2>
        <h3>Vous remportez la partie avec seulement <strong>{missed} erreur(s)</strong></h3>
        <p>appuie sur 'Entrer' pour continuer</p>
        {newGameButton}
      </div>
    )
    
    const loose = (
      <div>
        <h2>Perdu !!!!</h2>
        <h3>Le mot recherché était <strong>{searchedWord}</strong></h3>
        <p><em>appuie sur 'Entrer' pour continuer ou clique sur continuer</em></p>
        {newGameButton}
      </div>      
    )    
    
    if (statusGame === 'win') return win

    if (statusGame === 'loose') return loose
    
    return

}

function computeDisplay(searchedWord, matchedLetters, missed, maxMissed ) {     
    if (missed < maxMissed) {
      return searchedWord.replace(/\w/g,  (letter) => (matchedLetters.includes(letter) ? letter : '_'))
    }
}
 
const chrono = setTimeout(function(){ chrono(i)}, 1000) 

const DisplayGame = ({numberOfGames, score, searchedWord, missed, matchedLetters, maxMissed, statusGame, onClick}) => (
    <div className="col-md-7  mx-auto text-center">
        <section className="jumbotron text-center">
            <div className="col-md-7  mx-auto text-center">
                <span>score : {score} / {numberOfGames}</span>
            </div>    
            <div className="container">
                <img src={ updateImageSrc( missed ) } alt="Pendu" className="pendu" />
                <h1 className="jumbotron-heading">{ computeDisplay( searchedWord, matchedLetters, missed, maxMissed ) }</h1>
                { displayWinOrLoose(missed,searchedWord,statusGame,onClick) }
            </div>
        </section>
    </div>
)

// KeyBoard.propTypes = {
//   letter: PropTypes.string.isRequired,
//   feedback: PropTypes.oneOf([
//     'letterMatched',
//     'letterUnmatched',
//     'unTested'
//   ]).isRequired,
//   onClick: PropTypes.func.isRequired,
// }
export default DisplayGame
