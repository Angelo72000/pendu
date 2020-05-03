import React, {Component} from 'react';
import './DisplayGame.css'
import pendu0 from './img/pendu0.png';
import pendu1 from './img/pendu1.png';
import pendu2 from './img/pendu2.png';
import pendu3 from './img/pendu3.png';
import pendu4 from './img/pendu4.png';

class DisplayGameApp extends Component{
    
    constructor(props){
        super(props)
        this.score = 0
        this.pourcentage = 0
        this.numberOfGames = 0
    }

    updateImageSrc(missed){
        switch (missed) {
            case 1: return pendu1
            case 2: return pendu2
            case 3: return pendu3
            case 4: return pendu4
            default: return pendu0
        }
    }
    
    displayWinOrLoose(missed,searchedWord,statusGame, onClick){

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
        

        if (statusGame === 'win' || statusGame === 'loose') {
            this.calculerPourcentage()
            this.updauteDisplayScore()            
        }        
        if (statusGame === 'win') return win 
    
        if (statusGame === 'loose') return loose
        
        return false
    
    }
    
    computeDisplay(searchedWord, matchedLetters, missed, maxMissed ) {     
        if (missed < maxMissed) {
          return searchedWord.replace(/\w/g,  (letter) => (matchedLetters.includes(letter) ? letter : '_'))
        }
    }    

    calculerPourcentage(){
        const {score, loop} = this.props
        this.pourcentage = Math.round((score / loop) * 100)
    }
    
    updauteDisplayScore(){
        const {loop, score} = this.props
        this.numberOfGames = loop
        this.score = score
    }



    render(){
        const { missed, searchedWord, matchedLetters, maxMissed, statusGame, onClick, gameInProgress } = this.props
        const pourcentage = this.pourcentage
        const numberOfGames = this.numberOfGames
        const score = this.score
        const s = (score > 1)?'s':''
        let color =''      
        

        console.log(pourcentage)

        if ((pourcentage >= 50) && gameInProgress) {
            color = 'bg-success'
        }else if(pourcentage < 49 && pourcentage > 25){
            color = 'bg-warning'
        }else{
            color = 'bg-danger'
        }
      
        return(
            <div className="col-md-7  mx-auto text-center">
                <section className="jumbotron text-center">
                    <div className="row justify-content-md-center">
                        <div className="col-md 12 mx-auto text-center">
                            <div>Partie{s} remportée{s} : {score} / {numberOfGames}</div>
                        </div>    
                    </div>    
                    <div className="mt-3 row justify-content-md-center">
                        <div className="col-md-10 text-center">
                            <img src={ this.updateImageSrc( missed ) } alt="Pendu" className="pendu" />
                        </div>
                        <div className="col-md-2">
                            <div className="mx-auto progress progress-bar-vertical">
                                <div className={"progress-bar progress-striped " + color}
                                     role="progressbar" 
                                     aria-valuenow={pourcentage} 
                                     aria-valuemin="0" 
                                     aria-valuemax="100" 
                                     style={{height: pourcentage + '%'}}> 
                                </div>
                            </div>                        
                            <div className="mx-auto text-center pourcentage">Taux de réussite {pourcentage}%</div>
                        </div>                        
                    </div>          
                    <div className="row justify-content-md-center">
                        <div className="col-md-10 text-center">
                            <h1 className="jumbotron-heading">{ this.computeDisplay( searchedWord, matchedLetters, missed, maxMissed ) }</h1>
                            { this.displayWinOrLoose(missed,searchedWord,statusGame,onClick) }
                        </div>
                    </div>
    
                </section>
            </div>
        )
    }
    

}


export default DisplayGameApp