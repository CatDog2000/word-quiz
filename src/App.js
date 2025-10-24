import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// TODO: Replace with your actual Google Apps Script URL
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [words, setWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [isAnswerShown, setIsAnswerShown] = useState(false);

  const pickNextWord = useCallback((wordList) => {
    let list = wordList;
    // If the list is empty, reset it from the master list of words
    if (list.length === 0) {
      list = words;
    }

    if (list.length > 0) {
      const randomIndex = Math.floor(Math.random() * list.length);
      const word = list[randomIndex];

      setCurrentWord(word);
      // Update the list of remaining words
      setRemainingWords(list.filter((_, index) => index !== randomIndex));
    }

    // Hide the answer for the new word
    setIsAnswerShown(false);
  }, [words]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setWords(data);
        pickNextWord(data); // Pick the first word
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchWords();
  }, [pickNextWord]);

  const handleButtonClick = () => {
    if (isAnswerShown) {
      // If answer is shown, pick the next word
      pickNextWord(remainingWords);
    } else {
      // If answer is hidden, show it
      setIsAnswerShown(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>English Flashcards</h1>
        {currentWord ? (
          <div>
            <h2>{currentWord.Word}</h2>
            {isAnswerShown && (
              <p className="answer">{currentWord.Meaning}</p>
            )}
            <button onClick={handleButtonClick}>
              {isAnswerShown ? 'Next Word' : 'Show Answer'}
            </button>
          </div>
        ) : (
          <p>Loading words...</p>
        )}
      </header>
    </div>
  );
}

export default App;