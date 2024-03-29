import React, { useEffect, useState, useRef } from 'react';

import { PokemonClient } from 'pokenode-ts';

import './Quiz.css';

function getRandomId() {
  return Math.floor(Math.random() * 151) + 1;
}

async function getRandomPokemon() {
  const client = new PokemonClient();

  try {
    const data = await client.getPokemonById(getRandomId());
    return { name: data.name, img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png` };
  } catch (error) {
    console.error(error);
    return null;
  }
}

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const questionRefs = useRef([]);

  useEffect(() => {
    const initializeQuestionRefs = () => {
      questionRefs.current = Array(questions.length).fill(null);
    }

    initializeQuestionRefs();
  }, [questions]);

  const generateRandomOptions = async (correctName) => {
    const options = [correctName];
    while (options.length < 4) {
      const newOption = await getRandomPokemon();
      if (newOption && !options.includes(newOption.name) && newOption.name !== correctName) {
        options.push(newOption.name);
      }
    }
    return shuffleOptions(options);
  }

  const shuffleOptions = (options) => {
    const shuffledOptions = [...options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return shuffledOptions;
  }

  const generateQuestions = async () => {
    const newQuestions = [];

    for (let i = 0; i < 5; i++) {
      const randomPokemon = await getRandomPokemon();
      const correctAnswer = randomPokemon.name;
      const options = await generateRandomOptions(correctAnswer);

      const question = {
        text: `Who's that Pokemon?`,
        img: randomPokemon.img,
        correctAnswer: correctAnswer,
        options: options
      };

      newQuestions.push(question);
    }

    setQuestions(newQuestions);
  }

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleClickedOption = (index) => {
    const nextQuestionIndex = index + 1;
    const nextQuestionElement = questionRefs.current[nextQuestionIndex];
    if (nextQuestionElement) {
      nextQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className='container'>
      <h1>Pokemon Quiz</h1>
      {questions.map((question, index) => (
        <div key={index} ref={(ref) => (questionRefs.current[index] = ref)}>
          <form className='card-questions'>
            <label>{question.text}</label>
            {question.img && <img src={question.img} alt='pokemon' />}
            <div className='options'>
              {question.options.map((option, optionIndex) => (
                <button type='button' onClick={() => handleClickedOption(index)} key={optionIndex} className='btn btn-primary mx-2'>
                  {option}
                </button>
              ))}
            </div>
          </form>
        </div>
      ))}
    </div>
  );
};

export default Quiz;
