"use client";

import Letter from "@/components/letter";
import { useEffect, useState } from "react";

type Game = {
  solved: boolean;
  answer: string;
};

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGuesses = async () => {
      const res = await fetch("/answers.txt");
      const text = await res.text();

      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const gameArray: Game[] = lines.map((answer) => ({
        solved: false,
        answer: answer,
      }));

      setGames(shuffle(gameArray));
    };

    fetchGuesses();
  }, []);

  function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [currentEnteredWord, setCurrentEnteredWord] = useState<string>("");

  const [enterPressed, setEnterPressed] = useState(false);

  const [answersVisible, setAnswersVisible] = useState(false);

  const [size, setSize] = useState(4);

  let sizeClass: string;
  switch (size) {
    case 1:
      sizeClass =
        "grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";
      break;
    case 2:
      sizeClass =
        "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8";
      break;
    case 3:
      sizeClass =
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7";
      break;
    case 4:
      sizeClass =
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      break;
    case 5:
      sizeClass =
        "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      break;
    default:
      sizeClass =
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  }

  const MAX_GUESSES = games.length + 5;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        setCurrentEnteredWord((prev) => {
          if (prev.length < 5) {
            return (prev + event.key).toUpperCase();
          }
          return prev;
        });
      }

      if (event.key === "Backspace") {
        setCurrentEnteredWord((prev) => prev.slice(0, -1));
        console.log("Backspace pressed");
      }

      if (event.key === "Enter") {
        console.log("Enter pressed");
        setEnterPressed(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (enterPressed) {
      if (currentEnteredWord.length != 5) {
        console.log("Word must be five letters long");
      } else {
        setGuessedWords((prev) => {
          if (prev.length < MAX_GUESSES) {
            return [...prev, currentEnteredWord];
          }
          return prev;
        });

        for (let i = 0; i < games.length; i++) {
          if (games[i].answer == currentEnteredWord) {
            setGames((prev) => {
              const newGames = [...prev];
              newGames[i].solved = true;
              return newGames;
            });
            break;
          }
        }

        setCurrentEnteredWord("");
      }

      setEnterPressed(false);
    }
  }, [enterPressed, currentEnteredWord]);

  useEffect(() => {
    console.log("Guessed words updated:", guessedWords);
  }, [guessedWords]);

  useEffect(() => {
    console.log("Current word updated:", currentEnteredWord);
  }, [currentEnteredWord]);

  return (
    <>
      <div className="absolute top-4 right-4 justify-end items-end">
        <div className="flex justify-between items-center mb-4">
          <button
            className={`text-xl ${
              size != 1
                ? "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
                : "bg-gray-500/10 text-gray-600"
            } w-8 h-8 rounded-md transition ${
              size != 1 ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={() => {
              setSize((prev) => (prev == 1 ? prev : prev - 1));
            }}
            disabled={size == 1}
          >
            -
          </button>
          <span className="text-sm px-2">Change size</span>
          <button
            className={`text-xl ${
              size != 5
                ? "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
                : "bg-gray-500/10 text-gray-600"
            } w-8 h-8 rounded-md transition ${
              size != 5 ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={() => {
              setSize((prev) => (prev == 5 ? prev : prev + 1));
            }}
            disabled={size == 5}
          >
            +
          </button>
        </div>
        <div className="">
          <button
            onClick={() => {
              if (answersVisible) setAnswersVisible(false);
              else setAnswersVisible(true);
            }}
            className="flex items-center"
          >
            <div
              className={`${
                answersVisible
                  ? "bg-green-600/60 hover:bg-green-600/50 active:bg-green-600/40"
                  : "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
              } w-8 h-8 rounded-md cursor-pointer transition`}
            ></div>
            <label className="pl-2 text-sm cursor-pointer">Show answers</label>
          </button>
        </div>
      </div>

      <div className="px-8 py-16">
        <h1 className="text-7xl font-black">Everydle</h1>
        <h2 className="text-xl font-medium mt-2">
          Save 2000+ days of your time
        </h2>
        {/* Win every time
        Always win on the first guess
        It's much more efficient
        Save 2000 days of your time
        Play 2000+ games at once */}

        <div className="w-full flex gap-5 items-center justify-center mt-6 mb-16">
          <h4 className="">
            {guessedWords.length} / {MAX_GUESSES} guesses
          </h4>
          <h4 className="">
            {games.filter((game) => game.solved).length} / {games.length} solved
          </h4>
        </div>

        <div
          className={`grid ${sizeClass} justify-items-center align-items-center`}
        >
          {games.map((game, i) => (
            <div
              key={i}
              className={`${
                guessedWords.includes(game.answer)
                  ? "bg-green-300/30"
                  : "bg-gray-300/30"
              } h-min p-3 gap-3 rounded-md mb-6`}
            >
              {/* entered words rows */}
              {guessedWords
                .slice(
                  0,
                  guessedWords.includes(game.answer)
                    ? guessedWords.indexOf(game.answer) + 1
                    : guessedWords.length
                )
                .map((word, j) => (
                  <div className="flex gap-x-1 mb-1 " key={j}>
                    {[...word].slice(0, 5).map((char, k) => (
                      <Letter
                        key={k}
                        letter={char}
                        className={
                          char == game.answer[k]
                            ? "bg-green-500/60"
                            : game.answer.includes(char)
                            ? "bg-yellow-500/60"
                            : "bg-gray-400/60"
                        }
                        size={size}
                      />
                    ))}
                  </div>
                ))}
              {/* current word row */}
              <div
                className={`flex gap-x-1 ${
                  guessedWords.includes(game.answer) ? "hidden" : ""
                }`}
              >
                {[...currentEnteredWord].slice(0, 5).map((char, k) => (
                  <Letter key={k} letter={char} className="" size={size} />
                ))}
                {Array.from({ length: 5 - currentEnteredWord.length }).map(
                  (_, k) => (
                    <Letter key={k} letter="" className="" size={size} />
                  )
                )}
              </div>

              <span
                className={`${
                  answersVisible ? "block mt-2" : "hidden"
                } text-sm tracking-wider text-gray-700 italic`}
              >
                {game.answer}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
