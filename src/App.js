import React, { Component } from 'react';
import './App.css';
import CardDeck from './CardDeck';


class App extends Component {

  constructor() {
    super();

    this.state = {
      currentPlayer: 1,      //for now this must be 1 or 2
      scores: [0, 0, 0],     //scores[0] is not used; scores[n] contains the score for player n
      cardsRemaining: -1,    //number of cards remaining in deck
      currentCardValue: '',  //current card being played
      previousCardValue: '', //previous card played
      cardsInPile: 1,        //number of cards in face up pile
      turnsPlayed: 0,        //number of cards played in the current turn, used to determine if player can pass
      currentGuess: '',      //must be 'hi', 'lo', or '' to indicate no guess in play
      eogMessage: ''         //end of game message
    };

    this.cards = React.createRef();
  }
  
  guessHi() {
    //player guesses hi. Configure state and draw a card.
    this.setState({
      currentGuess: 'hi',
      previousCardValue: this.state.currentCardValue,
      turnsPlayed: this.state.turnsPlayed + 1
    });

    this.cards.current.drawCard();
  }

  guessLo() {
    //player guesses lo. Configure state and draw a card.
    this.setState({
      currentGuess: 'lo',
      previousCardValue: this.state.currentCardValue,
      turnsPlayed: this.state.turnsPlayed + 1
    });

    this.cards.current.drawCard();
  }

  pass() {
    this.setState({
      currentPlayer: (this.state.currentPlayer===1) ? 2 : 1,
      turnsPlayed: 0
    });
  }

  reset() {
    this.setState({
      currentPlayer: 1,
      scores: [0, 0, 0],
      cardsInPile: 1,
      currentGuess: '',
      turnsPlayed: 0,
      eogMessage: ''
    });
    
    this.cards.current.shuffleDeck()
  }

  playCard(newData) {
    //a new card has been drawn; play a turn
    this.setState({
      currentCardValue: newData.cardValue,
      cardsRemaining: newData.cardsRemaining
    });

    if (this.state.currentGuess === '') {
      //no guess; probably indicates initial game load
      return;
    }

    var prevCardVal = this.convertCardStringToValue(this.state.previousCardValue);
    var currCardVal = this.convertCardStringToValue(this.state.currentCardValue);

    //evaluate if the player guessed correctly
    //(the game rules did not state what to do in the case of a tie. For now I will assume it counts as a correct guess)
    if ( ((this.state.currentGuess === 'hi') && (currCardVal >= prevCardVal)) ||
         ((this.state.currentGuess === 'lo') && (currCardVal <= prevCardVal)) ) {

      //correct guess!  Increment pile count and allow current player to continue.
      this.setState({cardsInPile: this.state.cardsInPile+1});
    }
    else {
      //incorrect guess.  Add pile count to current player's score
      var currScores = this.state.scores;
      currScores[this.state.currentPlayer] += this.state.cardsInPile+1; //I assume that the card that was just played counts towards the pile

      //reset state to start a new "turn"
      this.setState({scores: currScores, cardsInPile: 1, turnsPlayed: 0});
    }

    //check for end of game
    if (this.state.cardsRemaining === 0) {
      this.setState({
        eogMessage: 'Congratulations, player ' + ((this.state.scores[1]<this.state.scores[2]) ? '1' : '2') + ' wins!' //TODO: handle case where they tie
      })

      //TODO: disable all buttons except Reset
    }
  }

  convertCardStringToValue(cardString) {
    if (cardString === 'ACE') {
      return 14;
    }
    if (cardString === 'KING') {
      return 13
    }
    if (cardString === 'QUEEN') {
      return 12;
    }
    if (cardString === 'JACK') {
      return 11;
    }

    return parseInt(cardString, 10);
  }

  render() {
    return (
      <div className="App">        
        <p>Hi-lo game, by Jimmy Nguyen</p>
        
        <p>Current player = {this.state.currentPlayer}</p>
        <p>Score = {this.state.scores[this.state.currentPlayer]}</p>
        <p>Cards remaining = {this.state.cardsRemaining}</p>
        <p>Cards in pile = {this.state.cardsInPile}</p>

        <CardDeck
          ref={this.cards}
          onPlayCard = {(x) => this.playCard(x)}
          />

        <button onClick={()=>this.guessHi()}>Guess - Hi</button>
        <button onClick={()=>this.guessLo()}>Guess - Lo</button>
        <button disabled={(this.state.turnsPlayed < 3)} onClick={()=>this.pass()}>Pass</button>
        <button onClick={()=>this.reset()}>Reset</button>

        <p>{this.state.eogMessage}</p>
      </div>
    );
  }
}

export default App;
