"use client";

import { useEffect, useRef, useState } from "react";

import CommonHead from "@/components/CommonHead";
import GameGrid from "@/components/GameGrid";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowRotateRight,
  faChevronDown,
  faCookie,
  faCookieBite,
  faDeleteLeft,
  faMinus,
  faPlus,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { compressToUTF16, decompressFromUTF16 } from "lz-string";

import {
  getLetterColor,
  removeDuplicates,
  shuffle,
  createAlert,
} from "@/utility";

import { Game, GuessedLetter } from "@/types";

export default function Play() {
  const [games, setGames] = useState<Game[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [possibleGuesses, setPossibleGuesses] = useState<string[]>([]);

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

  const [size, setSize] = useState<number>(2);
  const [typeInKeyboard, setTypeInKeyboard] = useState<boolean>(false);
  const [showPhantoms, setShowPhantoms] = useState<boolean>(true);
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [moveSolved, setMoveSolved] = useState<boolean>(false);
  const [answersVisible, setAnswersVisible] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);

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
      createAlert("Entered word must be five letters long", "red", "short");
    } else if (!possibleGuesses.includes(currentEnteredWord)) {
      createAlert("Entered word is not in word list", "red", "short");
    } else if (guessedWords.includes(currentEnteredWord)) {
      createAlert("Entered word has already been guessed", "red", "short");
    } else {
      /* const updatedGuessedWords = (prev: string[]) => {
          if (prev.length == MAX_GUESSES - 1) {
            setAnswersVisible(true);
            createAlert("Better luck next time! All answers are now visible.", "neutral");
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
        createAlert(
          "Better luck next time! All answers are now visible.",
          "neutral",
          "short",
        );
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
            createAlert(
              "Congratulations! You just solved every possible wordle game! Now go do something better with your time.",
              "green",
              "long",
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
      showKeyboard,
    };
    localStorage.setItem("options", JSON.stringify(options));
  }, [
    size,
    compactMode,
    showPhantoms,
    typeInKeyboard,
    moveSolved,
    answersVisible,
    showKeyboard,
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

    if (options && JSON.parse(options).showKeyboard !== undefined) {
      setShowKeyboard(JSON.parse(options).showKeyboard);
    } else {
      setShowKeyboard(true);
    }
  }, [dataLoaded]);

  /* keyboard letters */

  const keyboardRow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keyboardRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keyboardRow3 = ["Z", "X", "C", "V", "B", "N", "M"];

  return (
    <>
      <CommonHead />

      <div
        className={`${
          dataLoaded ? "invisible-fade" : "visible-fade"
        } absolute top-1/2 left-1/2 z-99 -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-gradient-to-br from-yellow-50/80 to-green-50/80 px-6 py-4 shadow-md transition`}
      >
        <p className="text-center text-xl font-medium text-neutral-700">
          Loading several thousand games of Wordle...
        </p>
      </div>

      <div className="sticky top-2 z-90 flex w-full justify-end lg:top-4">
        <div className="relative w-full">
          <div className="absolute right-2 flex flex-col items-end lg:right-4">
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => {
                  setShowOptions(!showOptions);
                }}
                className="w-fit cursor-pointer rounded-md bg-neutral-100/70 px-4 py-2 text-sm shadow-sm backdrop-blur-lg transition hover:bg-neutral-200/70 active:bg-neutral-300/70 md:text-base"
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
          </div>

          <div className="relative">
            <div
              className={`${
                showOptions ? "visible-fade" : "invisible-fade"
              } absolute top-10 right-2 w-60 rounded-md bg-neutral-100/70 p-4 shadow-sm backdrop-blur-lg lg:top-12 lg:right-4`}
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
                state={showKeyboard}
                setState={setShowKeyboard}
                text="Show keyboard"
                subtext="Show digital keyboard at the bottom of the screen"
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
                text="Move solved to bottom"
                subtext="Move solved games to the bottom of the grid"
              />
              {/* <Toggle
                state={answersVisible}
                setState={setAnswersVisible}
                text="Reveal answers"
                subtext="Show answers for all games"
              /> */}
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

      <div className="sticky top-2 z-80 flex w-full justify-end lg:top-4">
        <div className="relative w-full">
          <div className="absolute left-2 flex flex-col items-start gap-4 lg:left-4">
            <div className="items-center justify-center rounded-md bg-neutral-100/70 px-4 py-2.5 shadow-sm backdrop-blur-lg transition">
              <div className="text-left text-xs md:text-sm">
                <h3 className="inline">
                  <b className="text-sm md:text-base">{guessedWords.length}</b>{" "}
                  of {MAX_GUESSES}
                </h3>
                <h4 className="ml-1.5 inline text-neutral-500">guesses used</h4>
              </div>
              <div className="mt-2 border-t border-neutral-300 pt-2 text-left text-xs md:mt-2.5 md:pt-2.5 md:text-sm">
                <h3 className="inline">
                  <b className="text-sm md:text-base">
                    {games.filter((game) => game.solved).length}
                  </b>{" "}
                  of {games.length}
                </h3>
                <h4 className="ml-1.5 inline text-neutral-500">words solved</h4>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <div className="h-max w-full overflow-hidden rounded-full">
                  <div className="relative flex h-4 w-full items-center justify-center bg-neutral-400/30">
                    <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
                      <div
                        className={`h-full rounded-r-full bg-linear-to-br ${
                          games.filter((game) => game.solved).length >=
                            games.length &&
                          games.filter((game) => game.solved).length > 0
                            ? "from-green-400/70 to-green-600/70"
                            : "from-neutral-400/70 to-neutral-600/70"
                        } `}
                        style={{
                          width: `${(games.filter((game) => game.solved).length / games.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="off-toggle min-h-6 min-w-6 rounded-md transition"
                  onClick={() => {
                    const text =
                      "#everydle\nhttps://everydle.jakeo.dev\n" +
                      `${guessedWords.length} of ${MAX_GUESSES} guesses used\n` +
                      `${games.filter((game) => game.solved).length} of ${games.length} words solved\n` +
                      games.map((game) => (game.solved ? "✅" : "⬜")).join("");

                    navigator.clipboard.writeText(text);
                    createAlert(
                      "Copied current results to clipboard!",
                      "neutral",
                      "short",
                    );
                  }}
                >
                  <FontAwesomeIcon
                    icon={faShareNodes}
                    className="text-sm"
                    aria-label="Share results"
                    title="Share results"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pt-40 pb-16 md:pt-16">
        <div className="mb-12 flex items-center justify-center gap-4 md:mb-16 md:gap-5">
          <Image
            src="/everydle.png"
            alt="Everydle logo"
            width="100"
            height="100"
            className="w-12 md:w-15"
          />
          <h1 className="text-5xl font-black md:text-6xl">Everydle</h1>
        </div>

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
        <div id="alertRoot">
          {/* <Alert id="alert" text="Entered word has already been guessed" color="red" /> */}
        </div>
        {/* keyboard */}
        <div className="mx-auto w-full rounded-t-xl bg-neutral-100/70 p-2 shadow-sm backdrop-blur-lg sm:p-3 md:w-[26rem]">
          <div
            className={`${
              typeInKeyboard ? "" : "hidden"
            } mb-2 flex h-9 w-full items-center justify-center rounded-lg bg-neutral-400/30 sm:mb-3 sm:h-11`}
          >
            <span className="text-xl font-semibold tracking-wider md:text-2xl">
              {currentEnteredWord}
            </span>
          </div>

          {showKeyboard && (
            <div className="mb-2 sm:mb-3">
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
                  className="w-full items-center py-2"
                >
                  <FontAwesomeIcon icon={faDeleteLeft} className="mr-1.5" />
                  <span className="text-sm">Backspace</span>
                </Button>
                <Button
                  onClick={() => {
                    setEnterPressed(true);
                  }}
                  className="w-full items-center py-2"
                >
                  <span className="text-sm">Enter</span>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center text-xs">
            <a
              className="-mr-1.5 opacity-70 transition hover:opacity-80 hover:drop-shadow-md active:drop-shadow-none"
              href="https://jakeo.dev"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://www.jakeo.dev/logos/jakeo-wordmark.png"
                className="w-11"
              />
            </a>
            <span className="mx-2 text-neutral-400">•</span>
            <a
              className="group text-neutral-600 transition hover:text-blue-600"
              href="https://buymeacoffee.com/jakeorchanian"
              target="_blank"
              rel="noopener"
            >
              <div className="mr-1 inline">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  className="visible text-neutral-400 group-hover:invisible group-hover:w-0"
                  aria-hidden
                />
                <FontAwesomeIcon
                  icon={faCookie}
                  className="invisible w-0 text-blue-500 group-hover:visible group-hover:w-auto"
                  aria-hidden
                />
              </div>
              <span>Buy me a cookie</span>
            </a>
            <span className="mx-2 text-neutral-400">•</span>
            <a
              className="group text-neutral-600 transition hover:text-blue-600"
              href="https://github.com/jakeo-dev/everydle"
              target="_blank"
              rel="noopener"
            >
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
