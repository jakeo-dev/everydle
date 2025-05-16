"use client";

import { useEffect, useState } from "react";

import Head from "next/head";
import Button from "@/components/Button";
import Letter from "@/components/Letter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faDeleteLeft,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

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

  const [size, setSize] = useState(3);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [typeInKeyboard, setTypeInKeyboard] = useState(false);

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
            if (
              games.filter((game) => game.solved).length ==
              games.length - 1
            ) {
              setAnswersVisible(true);
              alert(
                "Congratulations! You just solved every possible wordle game! Now go do something better with your time."
              );
            }
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
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Everydle</title>

        <meta name="keywords" content="everydle, wordle, " />
        <meta
          property="description"
          content="Play every game of wordle at the same time."
        />

        <meta property="og:title" content="Everydle" />
        <meta
          property="og:description"
          content="Play every game of wordle at the same time."
        />
        <meta name="theme-color" content="#00c951" />
        <meta property="og:url" content="https://everydle.jakeo.dev" />

        <meta name="twitter:title" content="Everydle" />
        <meta
          name="twitter:description"
          content="Play every game of wordle at the same time."
        />
        <meta name="twitter:url" content="https://everydle.jakeo.dev" />
      </Head>

      <div className="absolute top-4 right-4 justify-end items-end">
        <div className="flex items-center">
          <button
            className={`w-6 h-6 rounded-md transition ${
              size != 1
                ? "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
                : "bg-gray-500/10 text-gray-600"
            } ${size != 1 ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={() => {
              setSize((prev) => (prev == 1 ? prev : prev - 1));
            }}
            disabled={size == 1}
          >
            <FontAwesomeIcon icon={faMinus} className="text-sm" aria-hidden />
          </button>
          <button
            className={`w-6 h-6 rounded-md transition ml-2 ${
              size != 5
                ? "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
                : "bg-gray-500/10 text-gray-600"
            } ${size != 5 ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={() => {
              setSize((prev) => (prev == 5 ? prev : prev + 1));
            }}
            disabled={size == 5}
          >
            <FontAwesomeIcon icon={faPlus} className="text-sm" aria-hidden />
          </button>
          <span className="text-sm pl-2">Change size</span>
        </div>
        <div className="mt-2.5 md:mt-4">
          <button
            onClick={() => {
              if (typeInKeyboard) setTypeInKeyboard(false);
              else setTypeInKeyboard(true);
            }}
            className="flex items-center"
          >
            <div
              className={`${
                typeInKeyboard
                  ? "bg-green-600/60 hover:bg-green-600/50 active:bg-green-600/40"
                  : "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
              } w-6 h-6 rounded-md cursor-pointer transition`}
            ></div>
            <label className="text-sm pl-2 cursor-pointer">
              Switch input mode
            </label>
          </button>
        </div>
        <div className="mt-2.5 md:mt-4">
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
              } w-6 h-6 rounded-md cursor-pointer transition`}
            ></div>
            <label className="text-sm pl-2 cursor-pointer">Show answers</label>
          </button>
        </div>
        <div className="text-xs text-center mt-2.5 md:mt-4">
          <div className="flex">
            <a
              className="hover:drop-shadow-md active:drop-shadow-none transition"
              href="https://jakeo.dev"
              target="_blank"
            >
              <img
                src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark.png"
                className="w-[3.25rem]"
              />
            </a>
            <span className="mx-2.5">•</span>
            <a
              className="hover:text-blue-600 transition"
              href="https://github.com/jakeo-dev/everydle"
              target="_blank"
            >
              <FontAwesomeIcon icon={faGithub} className="mr-1" aria-hidden />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="px-8 py-38 md:py-16">
        <h1 className="text-6xl md:text-7xl font-black">Everydle</h1>
        <h2 className="text-base md:text-xl font-medium italic text-pretty mt-2">
          {subtitle}
        </h2>

        <div className="w-full flex gap-6 items-center justify-center mt-6 mb-10 md:mb-16">
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
                  <div className="flex gap-x-1 mb-1" key={j}>
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
                {!typeInKeyboard
                  ? [...currentEnteredWord]
                      .slice(0, 5)
                      .map((char, k) => (
                        <Letter
                          key={k}
                          letter={char}
                          className=""
                          size={size}
                        />
                      ))
                  : ""}
                {typeInKeyboard && guessedWords.length > 0
                  ? ""
                  : Array.from({
                      length: typeInKeyboard
                        ? 5
                        : 5 - currentEnteredWord.length,
                    }).map((_, k) => (
                      <Letter key={k} letter="" className="" size={size} />
                    ))}
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
        <div className="bg-gray-100 shadow-xl rounded-t-xl w-full md:w-[32rem] mx-auto p-4">
          <div
            className={`bg-gray-200 h-10 md:h-12 w-full rounded-lg flex justify-center items-center mb-4 ${
              typeInKeyboard ? "" : "hidden"
            }`}
          >
            <span className="text-xl md:text-2xl font-semibold tracking-wider">
              {currentEnteredWord}
            </span>
          </div>

          {/* letters */}
          <div className="flex flex-col gap-y-1.5 sm:gap-y-2 items-center">
            <div className="flex gap-x-1.5 sm:gap-x-2">
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
                  className="w-7 h-9 sm:w-8 sm:h-10 pt-1 sm:pt-1.5"
                >
                  <span className="text-xl">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-x-1.5 sm:gap-x-2">
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
                  className="w-7 h-9 sm:w-8 sm:h-10 pt-1 sm:pt-1.5"
                >
                  <span className="text-xl">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-x-1.5 sm:gap-x-2">
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
                  className="w-7 h-9 sm:w-8 sm:h-10 pt-1 sm:pt-1.5"
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
    </>
  );
}
