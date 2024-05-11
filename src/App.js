import React, { useState, useEffect } from 'react';

const suits = ['♦', '♥', '♠', '♣'];
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const generateDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const Card = ({ card, onClick, highlightType }) => (
  <div
    onClick={() => onClick(card)}
    className='  m-3 p-6 px-7 bg-gray-200 rounded-md flex flex-col text-center hover:shadow-md cursor-pointer hover:-translate-y-2 transition-all duration-100'
    style={{
      backgroundColor: highlightType,
    }}
  >
    {card.value}{' '}
    <p
      className={`${
        card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : ''
      }`}
    >
      {card.suit}
    </p>
  </div>
);

function App() {
  const [deck, setDeck] = useState(generateDeck());
  const [players, setPlayers] = useState([]);
  const [activePlayerHand, setActivePlayerHand] = useState([]);
  const [highlightedPairs, setHighlightedPairs] = useState([]);
  const [highlightedSequences, setHighlightedSequences] = useState([]);

  useEffect(() => {
    const [player1, player2, player3] = dealCards(deck);
    setPlayers([player1, player2, player3]);
    setActivePlayerHand(player1);
  }, [deck]);

  const dealCards = (deck) => {
    return [deck.slice(0, 7), deck.slice(7, 14), deck.slice(14, 21)];
  };

  const findSequences = (hand, selectedCard) => {
    console.log('Original hand:', hand.slice());
    const sortedHand = hand.slice().sort((a, b) => a.value - b.value);
    console.log('Sorted hand:', sortedHand);
    let sequences = [];
    let currentSequence = [sortedHand[0]];

    for (let i = 1; i < sortedHand.length; i++) {
      const lastCard = currentSequence[currentSequence.length - 1];
      const currentCard = sortedHand[i];
      if (currentCard.value === lastCard.value + 1) {
        currentSequence.push(currentCard);
      } else {
        if (
          currentSequence.length >= 3 &&
          currentSequence.includes(selectedCard)
        ) {
          sequences.push([...currentSequence]);
        }
        currentSequence = [currentCard];
      }
    }

    if (currentSequence.length >= 3 && currentSequence.includes(selectedCard)) {
      sequences.push([...currentSequence]);
    }

    return sequences.flat();
  };

  const handleCardClick = (selectedCard) => {
    const sameValueCards = activePlayerHand.filter(
      (card) => card.value === selectedCard.value
    );
    let possiblePairs = [],
      possibleSequences = [];

    if (sameValueCards.length >= 2) {
      possiblePairs = [...sameValueCards];
    } else {
      possiblePairs = [];
    }

    const sequences = findSequences(activePlayerHand, selectedCard);
    if (sequences.length > 0) {
      possibleSequences = [...sequences];
    }

    setHighlightedPairs(possiblePairs);
    setHighlightedSequences(possibleSequences);
  };

  const executeMove = (moveType) => {
    let selectedCards =
      moveType === 'pair' ? highlightedPairs : highlightedSequences;
    const remainingCards = activePlayerHand.filter(
      (card) => !selectedCards.includes(card)
    );
    let newCard = deck.pop();

    if (newCard) {
      remainingCards.push(newCard);
    } else {
      console.log('Deck is empty, no more cards to draw.');
    }

    setActivePlayerHand(remainingCards);
    setHighlightedPairs([]);
    setHighlightedSequences([]);
  };

  return (
    <div className='flex flex-col w-full bg-gray-200 items-center h-screen justify-center relative'>
      <h1>Player A's Cards</h1>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {activePlayerHand.map((card) => (
          <Card
            key={`${card.value}${card.suit}`}
            card={card}
            onClick={handleCardClick}
            highlightType={
              highlightedPairs.includes(card)
                ? 'yellow'
                : highlightedSequences.includes(card)
                ? 'cyan'
                : 'white'
            }
          />
        ))}
      </div>
      {(highlightedPairs.length > 0 || highlightedSequences.length > 0) && (
        <div>
          {highlightedPairs.length > 0 && (
            <div
              className='btn btn-primary bg-gray-300 border  border-gray-600 px-4 py-2 rounded cursor-pointer hover:bg-gray-400'
              onClick={() => executeMove('pair')}
            >
              Play Pair
            </div>
          )}
          {highlightedSequences.length > 0 && (
            <div
              className='btn btn-primary bg-gray-300 border  border-gray-600 px-4 py-2 rounded cursor-pointer hover:bg-gray-400'
              onClick={() => executeMove('sequence')}
            >
              Play Sequence
            </div>
          )}
        </div>
      )}
      <div className='flex flex-col absolute bottom-1   '></div>
      <p className='flex items-center text-center'>
        <strong>Instructions:&nbsp;</strong>Select a card if their exists a
        &nbsp;
        <strong>sequence</strong> &nbsp;it will be highlighted in Cyan
        <span className='bg-cyan-300 h-4   w-4  rounded-full flex mx-1'></span>
      </p>
      <p className='flex items-center text-center'>
        if their exists a &nbsp; <strong>Pair</strong> &nbsp;it will be
        highlighted in Yellow
        <span className='bg-yellow-400 h-4   w-4  rounded-full flex mx-1'></span>
      </p>
      <p>Created by Rushikesh</p>
    </div>
  );
}

export default App;
