import React, { Component } from 'react';

//encapsulate the card deck and the basic shuffling and dealing operations
class CardDeck extends Component {
  constructor() {
    super();
    this.state = {
      deckid: -1,
      currentCardImg: '',
    };
  }

  componentDidMount() {
    this.shuffleDeck();
  }

  shuffleDeck() {
    //shuffle deck and draw the first card
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => response.json())
      .then(data => {
        //save our deck id
        this.setState({deckid: data.deck_id});
      })
      .then(() => this.drawCard());
  }

  drawCard() {
    //draw a card and issue the provided callback
    fetch('https://deckofcardsapi.com/api/deck/' + this.state.deckid + '/draw/?count=1')
    .then(response => response.json())
    .then(data => {
      this.setState({currentCardImg: data.cards[0].image});
      this.props.onPlayCard({
        cardValue: data.cards[0].value,
        cardsRemaining: data.remaining
      });
    })
  }

  render() {
    return (
      <div className="card">
        <img style={{width: 60, height: 90}} src ={this.state.currentCardImg} alt='' />
      </div>
    );
  }
}

export default CardDeck;
