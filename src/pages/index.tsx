"use client";

import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import GameGrid from "@/components/GameGrid";
import Button from "@/components/Button";

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
  const [typeInKeyboard, setTypeInKeyboard] = useState(false);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [virtualize, setVirtualize] = useState(true);

  const firstKeyRef = useRef<HTMLButtonElement>(null);
  const [keyWidth, setKeyWidth] = useState(0);

  useEffect(() => {
    // set width of all keyboard keys to the width of the keys in the first row (because there are the most letters there)
    if (firstKeyRef.current)
      setKeyWidth(firstKeyRef.current.getBoundingClientRect().width);

    // update width ono resize
    const handleResize = () => {
      if (firstKeyRef.current)
        setKeyWidth(firstKeyRef.current.getBoundingClientRect().width);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              games.filter((game) => game.solved).length >=
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

        <meta
          name="keywords"
          content="everydle, wordle, word game, puzzle game, game, daily"
        />
        <meta
          property="description"
          content="Play every game of Wordle at the same time."
        />

        <meta property="og:title" content="Everydle" />
        <meta
          property="og:description"
          content="Play every game of Wordle at the same time."
        />
        <meta name="theme-color" content="#00c951" />
        <meta property="og:url" content="https://everydle.jakeo.dev" />

        <meta name="twitter:title" content="Everydle" />
        <meta
          name="twitter:description"
          content="Play every game of Wordle at the same time."
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
        <div className="mt-2 md:mt-3">
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
        <div className="mt-2 md:mt-3">
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
        <div className="mt-2 md:mt-3">
          <button
            onClick={() => {
              if (virtualize) setVirtualize(false);
              else setVirtualize(true);
            }}
            className="flex items-center"
          >
            <div
              className={`${
                virtualize
                  ? "bg-green-600/60 hover:bg-green-600/50 active:bg-green-600/40"
                  : "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
              } w-6 h-6 rounded-md cursor-pointer transition`}
            ></div>
            <label className="text-sm pl-2 cursor-pointer">
              Enable virtualization
            </label>
          </button>
        </div>
        <div className="text-xs text-center mt-2 md:mt-3">
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

      <div className="px-8 py-42 md:py-16">
        <h1 className="text-6xl md:text-7xl font-black">Everydle</h1>
        <h2 className="text-base md:text-xl font-medium italic text-pretty mt-2">
          {subtitle}
        </h2>

        <div className="w-full sticky z-10 top-6 mt-6 mb-10 md:mb-16">
          <div className="bg-gray-200/80 rounded-full max-w-fit mx-auto">
            <div
              className={`${
                games.filter((game) => game.solved).length >=
                  games.length - 1 &&
                games.filter((game) => game.solved).length > 0
                  ? "bg-green-300/30 hover:bg-green-300"
                  : "bg-gray-300/30 hover:bg-gray-300"
              } flex gap-8 items-center justify-center rounded-full max-w-fit h-full px-6 py-2 mx-auto transition`}
            >
              <div>
                <h3 className="font-semibold">
                  {guessedWords.length} / {MAX_GUESSES}
                </h3>
                <h4 className="text-sm">guesses remaining</h4>
              </div>
              <div>
                <h3 className="font-semibold">
                  {games.filter((game) => game.solved).length} / {games.length}
                </h3>
                <h4 className="text-sm">words solved</h4>
              </div>
            </div>
          </div>
        </div>

        <GameGrid
          games={games}
          guessedWords={guessedWords}
          currentEnteredWord={currentEnteredWord}
          MAX_GUESSES={MAX_GUESSES}
          size={size}
          typeInKeyboard={typeInKeyboard}
          answersVisible={answersVisible}
          virtualize={virtualize}
        />
      </div>

      <div className="sticky bottom-0 left-0 right-0">
        {/* keyboard */}
        <div className="bg-gray-100 shadow-xl rounded-t-xl w-full md:w-[26rem] mx-auto p-2 sm:p-3">
          <div
            className={`${
              typeInKeyboard ? "" : "hidden"
            } bg-gray-200 h-9 sm:h-11 w-full rounded-lg flex justify-center items-center mb-2 sm:mb-3`}
          >
            <span className="text-xl md:text-2xl font-semibold tracking-wider">
              {currentEnteredWord}
            </span>
          </div>

          {/* letters */}
          <div className="flex flex-col gap-y-1 sm:gap-y-1.5 items-center w-full">
            <div className="flex gap-x-1 sm:gap-x-1.5 justify-center w-full">
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
                  className="flex-1 min-w-0 h-11 pt-2"
                  ref={firstKeyRef}
                >
                  <span className="text-lg">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-x-1 sm:gap-x-1.5 justify-center w-full">
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
                  className="min-w-0 h-11 pt-2"
                  style={{
                    width: `${keyWidth}px`,
                  }}
                >
                  <span className="text-lg">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-x-1 sm:gap-x-1.5 justify-center w-full">
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
                  className="min-w-0 h-11 pt-2"
                  style={{
                    width: `${keyWidth}px`,
                  }}
                >
                  <span className="text-lg">{letter}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* enter & backspace */}
          <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-3">
            <Button
              onClick={() => {
                setCurrentEnteredWord((prev) => prev.slice(0, -1));
              }}
              className="items-center w-full"
            >
              <FontAwesomeIcon icon={faDeleteLeft} className="mr-1.5" />
              <span className="text-sm">Backspace</span>
            </Button>
            <Button
              onClick={() => {
                setEnterPressed(true);
              }}
              className="items-center w-full"
            >
              <span className="text-sm">Enter</span>
              <FontAwesomeIcon icon={faArrowRight} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
