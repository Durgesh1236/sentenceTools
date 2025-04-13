import React, { useState, useEffect } from "react";

const questions = [
  {
    sentence: "The ___ jumps over the ___ dog.",
    answers: ["quick", "lazy", "happy", "brown"],
    correct: ["quick", "lazy"],
  },
  {
    sentence: "She ___ to the store to buy some ___.",
    answers: ["apples", "goes", "runs", "milk"],
    correct: ["goes", "milk"],
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [blanks, setBlanks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const question = questions[current];

  useEffect(() => {
    setBlanks(Array(question.correct.length).fill(""));
    setSelected([]);
    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleNext();
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current]);

  const handleSelect = (word) => {
    if (selected.includes(word)) return;
    const index = blanks.indexOf("");
    if (index !== -1) {
      const updated = [...blanks];
      updated[index] = word;
      setBlanks(updated);
      setSelected([...selected, word]);
    }
  };

  const handleUnselect = (index) => {
    const word = blanks[index];
    const updated = [...blanks];
    updated[index] = "";
    setBlanks(updated);
    setSelected(selected.filter((w) => w !== word));
  };

  const handleNext = () => {
    const correctAnswers = question.correct;
    const isCorrect =
      blanks.length === correctAnswers.length &&
      blanks.every((b, i) => b === correctAnswers[i]);

    const newResults = [
      ...results,
      {
        sentence: question.sentence,
        filled: [...blanks],
        correct: correctAnswers,
        isCorrect,
      },
    ];

    setResults(newResults);
    if (isCorrect) setScore(score + 1);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  };

  const filledSentence = () => {
    let parts = question.sentence.split("___");
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < blanks.length && (
          <span
            onClick={() => handleUnselect(i)}
            className="px-2 py-1 mx-1 bg-blue-200 rounded cursor-pointer hover:bg-blue-300"
          >
            {blanks[i] || "___"}
          </span>
        )}
      </span>
    ));
  };

  if (showResults) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Feedback</h2>
        <p className="mb-2 font-medium">Score: {score} / {questions.length}</p>
        {results.map((res, i) => (
          <div key={i} className="mb-4 text-left border p-3 rounded shadow">
            <p><strong>Sentence:</strong> {res.sentence}</p>
            <p><strong>Your Answer:</strong> {res.filled.join(" ")}</p>
            {!res.isCorrect && (
              <p className="text-red-600">
                <strong>Correct Answer:</strong> {res.correct.join(" ")}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Sentence Construction Tool</h1>
      <p className="mb-4 text-lg">{filledSentence()}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {question.answers.map((word, index) => (
          <button
            key={index}
            className={`p-2 bg-gray-200 rounded hover:bg-gray-300 ${
              selected.includes(word) ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleSelect(word)}
            disabled={selected.includes(word)}
          >
            {word}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">Time left: {timeLeft}s</span>
        <button
          onClick={handleNext}
          disabled={blanks.includes("")}
          className={`px-4 py-2 rounded text-white ${
            blanks.includes("") ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}