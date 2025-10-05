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
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

import { compressToUTF16, decompressFromUTF16 } from "lz-string";

import {
  getLetterColor,
  randomElement,
  removeDuplicates,
  shuffle,
} from "@/utility";

import { Game, GuessedLetter } from "@/types";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
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

      setAnswers(lines);

      if (typeof localStorage.getItem("games") !== "string") {
        // if games are NOT saved at all, set games to shuffled gameArray
        const gameArray: Game[] = lines.map((answer) => ({
          solved: false,
          answer: answer,
          guessedLetters: [],
        }));

        setGames(shuffle(gameArray));
      } else {
        setGames(
          localStorage.getItem("games")?.startsWith("[")
            ? JSON.parse(localStorage.getItem("games") || "[]") // if games are saved in plain text format, parse them
            : JSON.parse(
                decompressFromUTF16(localStorage.getItem("games") || "[]"), // if games are saved in compressed format, decompress & then parse them
              ),
        );
      }
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
      await fetchAnswers(); // fetch answers.txt
      await fetchGuesses(); // fetch possible guesses.txt & set possibleGuesses to guessesArray

      setDataLoaded(true); // set data load to true after possibleGuesses and gameArray are set
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
      localStorage.getItem("guessedWords") || '[""]',
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

  /* set random subtitle */

  useEffect(() => {
    setSubtitle(
      randomElement([
        `Always solve on the first guess`,
        `Save over 2,000 days of your time`,
        `Every wordle everywhere all at once`,
        `It's your fault if something crashes`,
        `Never worry about missing a day again`,
        `It's the same thing every day`,
        `"basically re-type the wordle word list with an increasingly unuseable UI"`,
        `"oh it gets worse 200 words in"`,
        `"NONONONONOONO, get it away from me!"`,
        `"increasingly onerous"`,
        `"wonderfully stupid"`,
        `"made me feel slightly queasy"`,
      ]),
    );
  }, []);

  const [size, setSize] = useState<number>(2);
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
          JSON.stringify(updatedGuessedWords),
        );

        setGames((prevGames) => {
          const newGames = [...prevGames];

          for (let i = 0; i < newGames.length; i++) {
            const game = newGames[i];
            const updatedGuessedLetters: GuessedLetter[] = [];

            // if the game is solved, dont add letters that have been guessed after it was solved
            const indexOfSolvedWord = updatedGuessedWords.indexOf(game.answer);
            const guessedWordsLimit =
              indexOfSolvedWord == -1
                ? updatedGuessedWords.length
                : indexOfSolvedWord + 1;

            // add each guessed letter (up until the solved word if the game is solved)
            for (let j = 0; j < guessedWordsLimit; j++) {
              const word = updatedGuessedWords[j];

              for (let k = 0; k < word.length; k++) {
                const char = word[k];
                const color = getLetterColor(word, char, k, game.answer);

                updatedGuessedLetters.push({
                  char: char,
                  pos: color == "green" ? k : color == "yellow" ? -1 : -2,
                  setPos: k,
                });
              }
            }

            const finalLetters: GuessedLetter[] = [];

            for (let l = 0; l < updatedGuessedLetters.length; l++) {
              const current = updatedGuessedLetters[l];

              // if character is already in finalLetters
              const existingIndex = finalLetters.findIndex(
                (g) => g.char === current.char && g.setPos === current.setPos,
              );

              if (existingIndex === -1) {
                // add to finalLetters if not already there
                finalLetters.push(current);
              } else if (
                current.pos >= 0 &&
                finalLetters[existingIndex].pos === -1
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
              "Congratulations! You just solved every possible wordle game! Now go do something better with your time.",
            );
          }

          return newGames;
        });

        localStorage.setItem("games", compressToUTF16(JSON.stringify(games)));
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
          content="everydle, wordle, word game, wordle unlimited, wordle of the day, wordle hint, dordle, quordle, octordle, sedecordle, duotrigordle, sexaginta-quattordle, sexagintaquattordle, polydle, puzzle game, game, daily, wordle variant, every wordle, wordle alternative, daily game, daily wordle, wordle spinoff, daily puzzle, puzzle game, wordle clone, nyt puzzle, nyt game, browser game"
        />
        <meta
          property="description"
          content="Play every Wordle at once in one extremely long sitting, and never worry about missing a day again."
        />

        <meta
          property="og:title"
          content="Everydle - Play every Wordle at once"
        />
        <meta
          property="og:description"
          content="Play every Wordle at once in one extremely long sitting, and never worry about missing a day again."
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
          content="Play every Wordle at once in one extremely long sitting, and never worry about missing a day again."
        />
        <meta name="twitter:url" content="https://everydle.jakeo.dev" />
        <meta
          name="twitter:image:src"
          content="https://jakeo.dev/images/everydle-ss-1.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <div
        className={`${
          dataLoaded ? "invisible-fade" : "visible-fade"
        } absolute top-1/2 left-1/2 z-99 -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-gradient-to-br from-yellow-50/80 to-green-50/80 px-6 py-4 shadow-md transition`}
      >
        <p className="text-center text-xl font-medium text-gray-700">
          Loading several thousand games of Wordle...
        </p>
      </div>

      <div className="sticky top-4 z-90 flex w-full justify-end">
        <div className="relative w-full">
          <div className="absolute right-4 flex flex-col items-end">
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => {
                  const text =
                    "#everydle\nhttps://everydle.jakeo.dev\n" +
                    `${guessedWords.length} of ${MAX_GUESSES} guesses used\n` +
                    `${games.filter((game) => game.solved).length} of ${games.length} words solved\n` +
                    games.map((game) => (game.solved ? "✅" : "⬜")).join("");

                  navigator.clipboard.writeText(text);
                  alert("Copied current results to clipboard!");
                }}
                className="w-fit cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm shadow-sm transition hover:bg-gray-200 md:text-base"
                ref={menuButtonRef}
              >
                <FontAwesomeIcon
                  icon={faShareNodes}
                  className="mr-2"
                  aria-hidden
                />
                Share
              </button>
              <button
                onClick={() => {
                  setShowOptions(!showOptions);
                }}
                className="w-fit cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm shadow-sm transition hover:bg-gray-200 md:text-base"
                ref={menuButtonRef}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`${
                    showOptions ? "rotate-180" : ""
                  } mr-2 transition duration-200`}
                  aria-hidden
                />
                Options
              </button>
            </div>
            <div className="mt-3 rounded-md bg-gray-100 px-4 py-2 text-center text-xs shadow-sm transition md:mt-4">
              <div className="flex justify-end">
                <a
                  className="transition hover:drop-shadow-md active:drop-shadow-none"
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
                  className="transition hover:text-blue-600"
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
              } absolute top-12 right-4 w-60 rounded-md bg-gray-200 p-4 shadow-sm`}
              ref={menuRef}
            >
              <div className="flex items-center">
                <button
                  className={`h-6 w-6 rounded-md transition ${
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
                  className={`ml-2 h-6 w-6 rounded-md transition ${
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
                <label className="cursor-default pl-2 text-sm" aria-hidden>
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
                subtext="Reduce size of each game tile"
              />
              <Toggle
                state={showPhantoms}
                setState={setShowPhantoms}
                disabled={compactMode}
                text="Show solved letters"
                subtext="Show solved letters in input line below each game"
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
              <div className="mt-2 flex items-center md:mt-3">
                <button
                  className="off-toggle h-6 w-6 rounded-md transition"
                  onClick={() => {
                    if (
                      confirm(
                        `You've already solved ${
                          games.filter((game) => game.solved).length
                        } words. Are you sure you want to restart?`,
                      )
                    ) {
                      setAnswersVisible(false);

                      localStorage.removeItem("games");
                      localStorage.removeItem("guessedWords");
                      location.reload();
                    }
                  }}
                  aria-labelledby="restartLabel"
                >
                  <FontAwesomeIcon
                    icon={faArrowRotateRight}
                    className="text-sm"
                    aria-hidden
                  />
                </button>
                <label
                  className="cursor-default pl-2 text-sm"
                  id="restartLabel"
                >
                  Restart game
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-4 z-80 flex w-full justify-end">
        <div className="relative w-full">
          <div className="absolute left-4 flex flex-col items-start gap-4">
            <div
              className={`${
                games.filter((game) => game.solved).length >= games.length &&
                games.filter((game) => game.solved).length > 0
                  ? "bg-green-200"
                  : "bg-gray-100"
              } items-center justify-center rounded-md px-4 py-2.5 shadow-sm transition`}
            >
              <div className="text-left text-xs md:text-sm">
                <h3>
                  <b className="text-sm md:text-base">{guessedWords.length}</b>{" "}
                  of {MAX_GUESSES}
                </h3>
                <h4>guesses used</h4>
              </div>
              <div className="mt-2 border-t border-gray-300 pt-2 text-left text-xs md:mt-2.5 md:pt-2.5 md:text-sm">
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
      </div>

      <div className="px-8 pt-40 pb-16 md:pt-16">
        <h1 className="text-6xl font-black md:text-7xl">Everydle</h1>
        <h2 className="mt-2 mb-10 text-base font-medium text-pretty text-gray-700 italic md:mb-16 md:text-lg">
          {subtitle}
        </h2>

        <GameGrid
          games={games}
          answers={answers}
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

      <div className="sticky right-0 bottom-0 left-0">
        {/* keyboard */}
        <div className="mx-auto w-full rounded-t-xl bg-gray-100 p-2 shadow-sm sm:p-3 md:w-[26rem]">
          <div
            className={`${
              typeInKeyboard ? "" : "hidden"
            } mb-2 flex h-9 w-full items-center justify-center rounded-lg bg-gray-200 sm:mb-3 sm:h-11`}
          >
            <span className="text-xl font-semibold tracking-wider md:text-2xl">
              {currentEnteredWord}
            </span>
          </div>

          {/* letters */}
          <div className="flex w-full flex-col items-center gap-y-1 sm:gap-y-1.5">
            <div className="flex w-full justify-center gap-x-1 sm:gap-x-1.5">
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
                  className="h-11 min-w-0 flex-1 pt-2"
                  ref={firstKeyRef}
                >
                  <span className="text-lg">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex w-full justify-center gap-x-1 sm:gap-x-1.5">
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
                  className="h-11 min-w-0 pt-2"
                  style={{
                    width: `${keyWidth}px`,
                  }}
                >
                  <span className="text-lg">{letter}</span>
                </Button>
              ))}
            </div>
            <div className="flex w-full justify-center gap-x-1 sm:gap-x-1.5">
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
                  className="h-11 min-w-0 pt-2"
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
          <div className="mt-2 flex gap-1 sm:mt-3 sm:gap-1.5">
            <Button
              onClick={() => {
                setCurrentEnteredWord((prev) => prev.slice(0, -1));
              }}
              className="w-full items-center"
            >
              <FontAwesomeIcon icon={faDeleteLeft} className="mr-1.5" />
              <span className="text-sm">Backspace</span>
            </Button>
            <Button
              onClick={() => {
                setEnterPressed(true);
              }}
              className="w-full items-center"
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
