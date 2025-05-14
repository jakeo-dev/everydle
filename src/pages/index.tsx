"use client";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Button from "@/components/Button";
import Letter from "@/components/Letter";
import { faArrowRight, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

type Game = {
  solved: boolean;
  answer: string;
};

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [possibleGuesses, setPossibleGuesses] = useState<string[]>([]);

  const [subtitle, setSubtitle] = useState<string>("");

  useEffect(() => {
    const fetchAnswers = async () => {
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

      setSubtitle(
        randomElement([
          `Win every time`,
          `Always win on the first guess`,
          `Save ${gameArray.length} days of your time`,
          `Play ${gameArray.length} games at once`,
          `Every wordle everywhere all at once`,
          `It's your fault if something crashes`,
        ])
      );
    };

    const fetchGuesses = async () => {
      const res = await fetch("/guesses.txt");
      const text = await res.text();

      const guessesArray = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      setPossibleGuesses(guessesArray);
    };

    fetchAnswers();
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
      if (
        event.key.length === 1 &&
        event.key.match(/[a-zA-Z]/) &&
        guessedWords.length < MAX_GUESSES
      ) {
        setCurrentEnteredWord((prev) => {
          if (prev.length < 5) {
            return (prev + event.key).toUpperCase();
          }
          return prev;
        });
      }

      if (event.key === "Backspace")
        setCurrentEnteredWord((prev) => prev.slice(0, -1));

      if (event.key === "Enter") setEnterPressed(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (enterPressed) {
      if (currentEnteredWord.length != 5) {
        alert("Entered word must be five letters long");
      } else if (!possibleGuesses.includes(currentEnteredWord)) {
        alert("Entered word is not in word list");
      } else {
        setGuessedWords((prev) => {
          if (prev.length == MAX_GUESSES - 1) {
            setAnswersVisible(true);
            alert("Better luck next time! All answers are now visible.");
          }
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

  /* useEffect(() => {
    console.log("Guessed words updated:", guessedWords);
  }, [guessedWords]);

  useEffect(() => {
    console.log("Current word updated:", currentEnteredWord);
  }, [currentEnteredWord]); */

  function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  const keyboardRow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keyboardRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keyboardRow3 = ["Z", "X", "C", "V", "B", "N", "M"];

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

      <div className="px-8 py-28 md:py-16">
        <h1 className="text-6xl md:text-7xl font-black">Everydle</h1>
        <h2 className="text-lg md:text-xl font-medium italic text-pretty mt-2">
          {subtitle}
        </h2>

        <div className="w-full flex gap-6 items-center justify-center mt-6 mb-16">
          <h4>
            {guessedWords.length} / {MAX_GUESSES} guesses
          </h4>
          <h4>
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
                game.solved ? "bg-green-300/30" : "bg-gray-300/30"
              } h-min p-3 gap-3 rounded-md mb-6`}
            >
              {/* entered words rows */}
              {guessedWords
                .slice(
                  0,
                  game.solved
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
                            : game.answer.includes(char) && // character is in answer
                              char != game.answer[k] && // character is not in the same position as character is in answer
                              !word.slice(0, k).includes(char) && // entered word does NOT contain the character BEFORE this character's position
                              Array.from({ length: 5 }).filter(
                                // the character appears twice in the entered word and the second appearance of the character is in the correct position in the answer
                                (_, i) =>
                                  word[i] === char && game.answer[i] === char
                              ).length < 1
                            ? "bg-yellow-500/60"
                            : game.answer.includes(char) && // character is in answer
                              char != game.answer[k] && // character is not in the same position as character is in answer
                              (!word.slice(0, k).includes(char) ||
                                word.slice(k, 5).includes(char)) && // entered word does NOT contain the character BEFORE this character's position OR entered word DOES contain the character AFTER this character's position
                              game.answer.replaceAll(
                                // character appears more than once in the answer
                                new RegExp(`[^${char}]`, "gi"),
                                ""
                              ).length > 1
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
                  game.solved || guessedWords.length == MAX_GUESSES
                    ? "hidden"
                    : ""
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
                } tracking-wider text-gray-700 italic`}
              >
                {game.answer}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0">
        {/* keyboard */}
        <div className="bg-gray-100 shadow-xl rounded-t-xl w-full md:w-[35rem] mx-auto p-4">
          {/* letters */}
          <div className="flex flex-col gap-y-2 items-center">
            <div className="flex gap-x-2">
              {keyboardRow1.map((letter, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    setCurrentEnteredWord((prev) => {
                      if (prev.length < 5) {
                        return prev + letter;
                      }
                      return prev;
                    });
                  }}
                  className="w-8 h-10 pt-1.5"
                >
                  <span className="text-xl">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-x-2">
              {keyboardRow2.map((letter, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    setCurrentEnteredWord((prev) => {
                      if (prev.length < 5) {
                        return prev + letter;
                      }
                      return prev;
                    });
                  }}
                  className="w-8 h-10 pt-1.5"
                >
                  <span className="text-xl">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-x-2">
              {keyboardRow3.map((letter, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    setCurrentEnteredWord((prev) => {
                      if (prev.length < 5) {
                        return prev + letter;
                      }
                      return prev;
                    });
                  }}
                  className="w-8 h-10 pt-1.5"
                >
                  <span className="text-xl">{letter}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* enter & backspace */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => {
                setCurrentEnteredWord((prev) => prev.slice(0, -1));
              }}
              className="items-center w-full"
            >
              <FontAwesomeIcon icon={faDeleteLeft} className="mr-2" />
              <span className="text-sm">Backspace</span>
            </Button>
            <Button
              onClick={() => {
                setEnterPressed(true);
              }}
              className="items-center w-full"
            >
              <span className="text-sm">Enter</span>
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="bg-gray-300/30 w-full p-3 md:py-4 md:px-8">
        <div className="text-xs md:text-sm text-center">
          <div className="flex justify-center items-center">
            <a
              className="hover:drop-shadow-md active:drop-shadow-none transition"
              href="https://jakeo.dev"
              target="_blank"
            >
              <img
                src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark.png"
                className="w-[3.25rem] md:w-16"
              />
            </a>
            <span className="mx-2 md:mx-3">•</span>
            <a
              className="hover:text-blue-600 underline decoration-[1.5px] hover:decoration-wavy hover:decoration-[0.75px] transition"
              href="https://github.com/jakeo-dev/everydle"
              target="_blank"
            >
              <FontAwesomeIcon icon={faGithub} className="mr-1" aria-hidden />
              <span>GitHub</span>
            </a>
          </div>
          {/* <h3 className="text-xs italic mt-2">
            i know you havent solved every game yet. scroll back up.
          </h3> */}
        </div>
      </footer>
    </>
  );
}
