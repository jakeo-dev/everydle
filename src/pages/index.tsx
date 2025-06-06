"use client";

import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import GameGrid from "@/components/GameGrid";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faArrowRotateRight,
  faChevronDown,
  faDeleteLeft,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { getLetterColor, removeDuplicates } from "@/utility";

import { Game, GuessedLetter } from "@/types";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [possibleGuesses, setPossibleGuesses] = useState<string[]>([]);

  const [subtitle, setSubtitle] = useState<string>("");

  const [dataLoaded, setDataLoaded] = useState(false);

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
        guessedLetters: [],
      }));

      setGames(
        JSON.parse(
          localStorage.getItem("games") || JSON.stringify(shuffle(gameArray))
        )
      );

      setSubtitle(
        randomElement([
          `Always win on the first guess`,
          `Save ${gameArray.length} days of your time`,
          `Play ${gameArray.length} games at once`,
          `Every wordle everywhere all at once`,
          `It's your fault if something crashes`,
          `Never worry about missing a day again`,
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

    const loadData = async () => {
      await fetchAnswers();
      await fetchGuesses();
      setDataLoaded(true); // set data loadd to true after possibleGuesses and gameArray are set
    };

    loadData();
  }, []);

  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [currentEnteredWord, setCurrentEnteredWord] = useState<string>("");

  const [enterPressed, setEnterPressed] = useState(false);

  useEffect(() => {
    // after data is loaded, set guessedWords to whats saved in local storage (EXCEPT the last word)
    // set current word to the last entered word in guessed words in local storage
    if (!dataLoaded) return;

    const currentGuessedWords = JSON.parse(
      localStorage.getItem("guessedWords") || '[""]'
    );
    const lastCurrentGuessedWord = currentGuessedWords.pop();

    setGuessedWords(currentGuessedWords);
    setCurrentEnteredWord(lastCurrentGuessedWord);
  }, [dataLoaded]);

  useEffect(() => {
    // make sure the currentEnteredWord is the one thats last in the local storage
    // if it is, simulate pressing enter to add this last word to guessedWords and make sure a bunch of other stuff is done
    if (
      currentEnteredWord ==
        JSON.parse(localStorage.getItem("guessedWords") || '[""]')[
          guessedWords.length
        ] &&
      currentEnteredWord.length == 5
    ) {
      setEnterPressed(true);
    }
  }, [currentEnteredWord]);

  const [size, setSize] = useState<number>(1);
  const [typeInKeyboard, setTypeInKeyboard] = useState<boolean>(false);
  const [showPhantoms, setShowPhantoms] = useState<boolean>(true);
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [moveSolved, setMoveSolved] = useState<boolean>(false);
  const [answersVisible, setAnswersVisible] = useState<boolean>(false);

  const firstKeyRef = useRef<HTMLButtonElement>(null);
  const [keyWidth, setKeyWidth] = useState(0);

  useEffect(() => {
    // set width of all keyboard keys to the width of the keys in the first row (because there are the most letters there)
    if (firstKeyRef.current)
      setKeyWidth(firstKeyRef.current.getBoundingClientRect().width);

    // update width on resize
    const handleResize = () => {
      if (firstKeyRef.current)
        setKeyWidth(firstKeyRef.current.getBoundingClientRect().width);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MAX_GUESSES = games.length + 5;

  /* random functions */

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

  function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /* handle clicking letters */

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

  /* handle submitting entered word */

  useEffect(() => {
    if (!enterPressed) return;

    if (currentEnteredWord.length != 5) {
      alert("Entered word must be five letters long");
    } else if (!possibleGuesses.includes(currentEnteredWord)) {
      alert("Entered word is not in word list");
    } else if (guessedWords.includes(currentEnteredWord)) {
      alert("Entered word has already been guessed");
    } else {
      /* const updatedGuessedWords = (prev: string[]) => {
          if (prev.length == MAX_GUESSES - 1) {
            setAnswersVisible(true);
            alert("Better luck next time! All answers are now visible.");
          }
          if (prev.length < MAX_GUESSES) {
            return [...prev, currentEnteredWord];
          }
          return prev;
        };
        setGuessedWords(updatedGuessedWords); */

      const updatedGuessedWords = [...guessedWords, currentEnteredWord];
      if (updatedGuessedWords.length >= MAX_GUESSES) {
        setAnswersVisible(true);
        alert("Better luck next time! All answers are now visible.");
      }
      if (updatedGuessedWords.length <= MAX_GUESSES) {
        setGuessedWords(updatedGuessedWords);
        localStorage.setItem(
          "guessedWords",
          JSON.stringify(updatedGuessedWords)
        );

        setGames((prevGames) => {
          const newGames = [...prevGames];

          for (let i = 0; i < newGames.length; i++) {
            const game = newGames[i];
            const updatedGuessedLetters: GuessedLetter[] = [];

            for (let j = 0; j < updatedGuessedWords.length; j++) {
              const word = updatedGuessedWords[j];

              for (let k = 0; k < word.length; k++) {
                const char = word[k];
                const color = getLetterColor(word, char, k, game.answer);

                updatedGuessedLetters.push({
                  character: char,
                  position: color == "green" ? k : color == "yellow" ? -1 : -2,
                  placedPosition: k,
                });
              }
            }

            const finalLetters: GuessedLetter[] = [];

            for (let l = 0; l < updatedGuessedLetters.length; l++) {
              const current = updatedGuessedLetters[l];

              // if character is already in finalLetters
              const existingIndex = finalLetters.findIndex(
                (g) =>
                  g.character === current.character &&
                  g.placedPosition === current.placedPosition
              );

              if (existingIndex === -1) {
                // add to finalLetters if not already there
                finalLetters.push(current);
              } else if (
                current.position >= 0 &&
                finalLetters[existingIndex].position === -1
              ) {
                finalLetters[existingIndex] = current;
              }
            }

            game.guessedLetters = removeDuplicates(finalLetters);

            // set solved to true if solved
            if (currentEnteredWord === game.answer) game.solved = true;
          }

          // check if all are solved
          const solvedCount = newGames.filter((g) => g.solved).length;
          if (solvedCount >= newGames.length) {
            setAnswersVisible(true);
            alert(
              "Congratulations! You just solved every possible wordle game! Now go do something better with your time."
            );
          }

          return newGames;
        });

        localStorage.setItem("games", JSON.stringify(games));
      }

      setCurrentEnteredWord("");
    }

    setEnterPressed(false);
  }, [enterPressed]);

  /* options */

  const [showOptions, setShowOptions] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  function handleOutsideClick(event: MouseEvent) {
    if (
      menuRef.current &&
      menuButtonRef.current &&
      !menuRef.current.contains(event.target as Element) &&
      !menuButtonRef.current.contains(event.target as Element)
    )
      setShowOptions(false);
  }

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  /* save options */

  useEffect(() => {
    if (!dataLoaded) return;

    const options = {
      size,
      compactMode,
      showPhantoms,
      typeInKeyboard,
      moveSolved,
      answersVisible,
    };
    localStorage.setItem("options", JSON.stringify(options));
  }, [
    size,
    compactMode,
    showPhantoms,
    typeInKeyboard,
    moveSolved,
    answersVisible,
  ]);

  useEffect(() => {
    if (!dataLoaded) return;

    const options = localStorage.getItem("options");

    if (options && JSON.parse(options).size) {
      setSize(Number(JSON.parse(options).size));
    } else {
      setSize(window.innerWidth >= 768 ? 3 : 2);
    }

    if (options && JSON.parse(options).compactMode !== undefined) {
      setCompactMode(JSON.parse(options).compactMode);
    } else {
      setCompactMode(false);
    }

    if (options && JSON.parse(options).showPhantoms !== undefined) {
      setShowPhantoms(JSON.parse(options).showPhantoms);
    } else {
      setShowPhantoms(true);
    }

    if (options && JSON.parse(options).typeInKeyboard !== undefined) {
      setTypeInKeyboard(JSON.parse(options).typeInKeyboard);
    } else {
      setTypeInKeyboard(false);
    }

    if (options && JSON.parse(options).moveSolved !== undefined) {
      setMoveSolved(JSON.parse(options).moveSolved);
    } else {
      setMoveSolved(false);
    }

    if (options && JSON.parse(options).answersVisible !== undefined) {
      setAnswersVisible(JSON.parse(options).answersVisible);
    } else {
      setAnswersVisible(false);
    }
  }, [dataLoaded]);

  /* keyboard letters */

  const keyboardRow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keyboardRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keyboardRow3 = ["Z", "X", "C", "V", "B", "N", "M"];

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Everydle - Play every Wordle at once</title>

        <meta
          name="keywords"
          content="everydle, wordle, word game, puzzle game, game, daily, wordle variant, every wordle, wordle alternative, daily game, daily wordle, wordle spinoff, daily puzzle, puzzle game, wordle clone, nyt puzzle, nyt game, browser game"
        />
        <meta
          property="description"
          content="Solve every Wordle at once in one extremely long sitting instead of spending five minutes every day, and never worry about missing one again."
        />

        <meta
          property="og:title"
          content="Everydle - Play every Wordle at once"
        />
        <meta
          property="og:description"
          content="Solve every Wordle at once in one extremely long sitting instead of spending five minutes every day, and never worry about missing one again."
        />
        <meta name="theme-color" content="#00c951" />
        <meta property="og:url" content="https://everydle.jakeo.dev" />
        <meta
          property="og:image"
          content="https://jakeo.dev/images/everydle-ss-1.png"
        />

        <meta
          name="twitter:title"
          content="Everydle - Play every Wordle at once"
        />
        <meta
          name="twitter:description"
          content="Solve every Wordle at once in one extremely long sitting instead of spending five minutes every day, and never worry about missing one again."
        />
        <meta name="twitter:url" content="https://everydle.jakeo.dev" />
        <meta
          name="twitter:image:src"
          content="https://jakeo.dev/images/everydle-ss-1.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <div className="w-full flex justify-end sticky top-4 z-90">
        <div className="relative w-full">
          <div className="absolute right-4 flex flex-col items-end">
            <button
              onClick={() => {
                setShowOptions(!showOptions);
              }}
              className="text-sm md:text-base bg-gray-100 hover:bg-gray-200 shadow-sm rounded-md w-fit px-4 py-2 cursor-pointer transition"
              ref={menuButtonRef}
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`${
                  showOptions ? "rotate-180" : ""
                } transition duration-200 mr-2`}
                aria-hidden
              />
              Options
            </button>
            <div className="text-xs text-center bg-gray-100 shadow-sm rounded-md px-4 py-2 mt-3 md:mt-4 transition">
              <div className="flex justify-end">
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
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="mr-1"
                    aria-hidden
                  />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className={`${
                showOptions ? "visible-fade" : "invisible-fade"
              } absolute top-12 right-4 bg-gray-200 rounded-md w-60 shadow-sm p-4`}
              ref={menuRef}
            >
              <div className="flex items-center">
                <button
                  className={`w-6 h-6 rounded-md transition ${
                    size != 1 ? "off-toggle" : "off-toggle-disabled"
                  }`}
                  onClick={() => {
                    setSize((prev) => (prev == 1 ? prev : prev - 1));
                  }}
                  disabled={size == 1}
                  aria-label="Decrease size"
                >
                  <FontAwesomeIcon
                    icon={faMinus}
                    className="text-sm"
                    aria-hidden
                  />
                </button>
                <button
                  className={`w-6 h-6 rounded-md transition ml-2 ${
                    size != 5 ? "off-toggle" : "off-toggle-disabled"
                  }`}
                  onClick={() => {
                    setSize((prev) => (prev == 5 ? prev : prev + 1));
                  }}
                  disabled={size == 5}
                  aria-label="Increase size"
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-sm"
                    aria-hidden
                  />
                </button>
                <label className="text-sm cursor-default pl-2" aria-hidden>
                  Change size
                </label>
              </div>
              <Toggle
                state={compactMode}
                setState={setCompactMode}
                onClick={() => {
                  if (!compactMode) setShowPhantoms(true);
                }}
                text="Enable compact mode"
                subtext="Only show yellow letters above input line and always show solved letters"
              />
              <Toggle
                state={showPhantoms}
                setState={setShowPhantoms}
                disabled={compactMode}
                text="Show solved letters"
                subtext="Show all solved letters in input line below each game"
              />
              <Toggle
                state={typeInKeyboard}
                setState={setTypeInKeyboard}
                text="Switch input mode"
                subtext="Input letters above keyboard instead of below each game"
              />
              <Toggle
                state={moveSolved}
                setState={setMoveSolved}
                text="Move solved to top"
                subtext="Move solved games to the top of the grid"
              />
              <Toggle
                state={answersVisible}
                setState={setAnswersVisible}
                text="Reveal answers"
                subtext="Show answers for all games"
              />
              <div className="flex items-center mt-2 md:mt-3">
                <button
                  className="w-6 h-6 rounded-md transition off-toggle"
                  onClick={() => {
                    if (
                      confirm(
                        `You've already solved ${
                          games.filter((game) => game.solved).length
                        } words. Are you sure you want to restart?`
                      )
                    ) {
                      localStorage.removeItem("games");
                      localStorage.removeItem("guessedWords");
                      location.reload();
                    }
                  }}
                  aria-label="Restart game"
                >
                  <FontAwesomeIcon
                    icon={faArrowRotateRight}
                    className="text-sm"
                    aria-hidden
                  />
                </button>
                <span className="text-sm cursor-default pl-2" aria-hidden>
                  Restart game
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end sticky top-4 z-80">
        <div className="relative w-full">
          <div
            className={`${
              games.filter((game) => game.solved).length >= games.length &&
              games.filter((game) => game.solved).length > 0
                ? "bg-green-200"
                : "bg-gray-100"
            } items-center justify-center absolute left-4 shadow-sm rounded-md px-4 py-2.5 transition`}
          >
            <div className="text-xs md:text-sm text-left">
              <h3>
                <b className="text-sm md:text-base">{guessedWords.length}</b> of{" "}
                {MAX_GUESSES}
              </h3>
              <h4>guesses used</h4>
            </div>
            <div className="text-xs md:text-sm text-left border-t border-gray-300 pt-2 mt-2 md:pt-2.5 md:mt-2.5">
              <h3>
                <b className="text-sm md:text-base">
                  {games.filter((game) => game.solved).length}
                </b>{" "}
                of {games.length}
              </h3>
              <h4>words solved</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-16 pt-36 md:pt-16">
        <h1 className="text-6xl md:text-7xl font-black">Everydle</h1>
        <h2 className="text-base md:text-lg font-medium text-gray-700 italic text-pretty mt-2 mb-10 md:mb-16">
          {subtitle}
        </h2>

        <GameGrid
          games={games}
          guessedWords={guessedWords}
          currentEnteredWord={currentEnteredWord}
          MAX_GUESSES={MAX_GUESSES}
          size={size}
          typeInKeyboard={typeInKeyboard}
          compactMode={compactMode}
          showPhantoms={showPhantoms}
          moveSolved={moveSolved}
          answersVisible={answersVisible}
        />
      </div>

      <div className="sticky bottom-0 left-0 right-0">
        {/* keyboard */}
        <div className="bg-gray-100 shadow-sm rounded-t-xl w-full md:w-[26rem] mx-auto p-2 sm:p-3">
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
