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
const reloadPage = () => {
  window.location.reload();
};
const Card = ({ card, onClick, highlightType, className }) => (
  <div
    onClick={() => onClick(card)}
    className={` ${className} text-black  m-3 p-6 px-7 bg-gray-200 rounded-md flex flex-col text-center hover:shadow-md cursor-pointer hover:-translate-y-2 transition-all duration-100`}
    style={{
      backgroundColor: highlightType,
    }}
  >
    {card.value}{' '}
    <p
      className={`${
        card.suit === '♥' || card.suit === ':diamonds:' ? 'text-red-600' : ''
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
  const [selectedCard, setSelectedCard] = useState(null);
  useEffect(() => {
    const [player1, player2, player3] = dealCards(deck);
    setPlayers([player1, player2, player3]);
    setActivePlayerHand(player1);
  }, [deck]);
  const dealCards = (deck) => {
    return [deck.slice(0, 7), deck.slice(7, 14), deck.slice(14, 21)];
  };
  const findSequences = (hand, selectedCard) => {
    // Sort the hand by value
    const uniqueHand = hand.filter(
      (card, index) => hand.findIndex((c) => c.value === card.value) === index
    );
    const sortedHand = uniqueHand.sort((a, b) => a.value - b.value);
    let longestSequence = [];
    let currentSequence = [];
    // Iterate through the sortedHand
    for (let i = 0; i < sortedHand.length; i++) {
      // If the current card is part of a sequence
      if (i === 0 || sortedHand[i].value === sortedHand[i - 1].value + 1) {
        currentSequence.push(sortedHand[i]);
      } else {
        // Check if the current sequence is longer than the longest one found so far
        if (currentSequence.length > longestSequence.length) {
          longestSequence = [...currentSequence];
        }
        // Start a new sequence
        currentSequence = [sortedHand[i]];
      }
    }
    // Check if the last sequence is longer than the longest one found so far
    if (currentSequence.length > longestSequence.length) {
      longestSequence = [...currentSequence];
    }
    // Check if the longest sequence includes the selected card and has a length of at least 3
    const includes1 = longestSequence.reduce(
      (acc, card) => acc || card.value === selectedCard.value,
      false
    );
    const includes2 = currentSequence.reduce(
      (acc, card) => acc || card.value === selectedCard.value,
      false
    );
    if (includes1 && longestSequence.length >= 3) {
      console.log(includes1, includes2);
      return longestSequence;
    }
    if (includes2 && currentSequence.length >= 3) {
      console.log(includes1, includes2);
      return currentSequence;
    }
    return [];
  };
  const handleCardClick = (selectedCard) => {
    setSelectedCard(selectedCard);
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
    const remainingCards = activePlayerHand.filter((card) => {
      return !selectedCards.includes(card);
    });
    // let newCard = deck.pop();
    // if (newCard) {
    //   remainingCards.push(newCard);
    // } else {
    //   console.log('Deck is empty, no more cards to draw.');
    // }
    setActivePlayerHand(remainingCards);
    setHighlightedPairs([]);
    setHighlightedSequences([]);
  };
  return (
    <div className='relative flex flex-col items-center justify-center w-full h-screen bg-gray-200'>
      <button
        onClick={() => reloadPage()}
        className='text-white btn btn-active btn-success'
      >
        Deal Cards
      </button>

      <h1>Player A's Cards</h1>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {activePlayerHand.map(
          (card) => (
            console.log('card', card),
            (
              <Card
                key={`${card.value}${card.suit}`}
                card={card}
                onClick={handleCardClick}
                className={
                  card == selectedCard
                    ? 'bg-blue-200   shadow-md    -translate-y-2 border border-blue-300 '
                    : 'bg-white'
                }
                // highlightType={}
              />
            )
          )
        )}
        {console.log('seq', highlightedSequences)}
      </div>
      <div className='flex gap-3'>
        {highlightedPairs.length > 0 && (
          <div
            className='p-1 bg-gray-300 border border-gray-400 rounded-lg'
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            {highlightedPairs.map(
              (card) => (
                console.log('card', card),
                (
                  <Card
                    key={`${card.value}${card.suit}`}
                    card={card}
                    onClick={handleCardClick}
                    highlightType={'white'}
                  />
                )
              )
            )}
            {console.log('seq', highlightedSequences)}
          </div>
        )}
        {highlightedSequences.length > 0 && (
          <div
            className='p-1 bg-gray-300 border border-gray-400 rounded-lg'
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            {highlightedSequences.map(
              (card) => (
                console.log('card', card),
                (
                  <Card
                    key={`${card.value}${card.suit}`}
                    card={card}
                    onClick={handleCardClick}
                    highlightType={'white'}
                  />
                )
              )
            )}
          </div>
        )}
      </div>
      {(highlightedPairs.length > 0 || highlightedSequences.length > 0) && (
        <div className='flex gap-2 m-2 '>
          {highlightedPairs.length > 0 && (
            <button
              onClick={() => executeMove('pair')}
              className='text-white btn btn-active btn-primary'
            >
              Play Pair
            </button>
          )}
          {highlightedSequences.length > 0 && (
            <button
              onClick={() => executeMove('sequence')}
              className='text-white btn btn-active btn-primary'
            >
              Play Sequence
            </button>
          )}
        </div>
      )}
      {/* <div className='absolute flex flex-col bottom-1 '></div>
      <p className='flex items-center text-center'>
        <strong>Instructions:&nbsp;</strong>Select a card if their exists a
        &nbsp;
        <strong>sequence</strong> &nbsp;it will be highlighted in Cyan
        <span className='flex w-4 h-4 mx-1 rounded-full bg-cyan-300'></span>
      </p>
      <p className='flex items-center text-center'>
        if their exists a &nbsp; <strong>Pair</strong> &nbsp;it will be
        highlighted in Yellow
        <span className='flex w-4 h-4 mx-1 bg-yellow-400 rounded-full'></span>
      </p>
      <p>Created by Rushikesh</p> */}
    </div>
  );
}
export default App;
