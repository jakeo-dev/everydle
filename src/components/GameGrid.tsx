import { Masonry } from "masonic";
import { useEffect, useState } from "react";

import Letter from "@/components/Letter";
import React from "react";

import { getLetterColor, getSizeClass } from "@/utility";

import { Game } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

type GameGridProps = {
  games: Game[];
  answers: string[];
  guessedWords: string[];
  currentEnteredWord: string;
  MAX_GUESSES: number;
  size: number;
  typeInKeyboard: boolean;
  compactMode: boolean;
  showPhantoms: boolean;
  answersVisible: boolean;
  moveSolved: boolean;
};

type GameProps = {
  guessedWords: string[];
  currentEnteredWord: string;
  MAX_GUESSES: number;
  size: number;
  typeInKeyboard: boolean;
  compactMode: boolean;
  showPhantoms: boolean;
  answersVisible: boolean;
  game: Game;
  index: number;
};

function GameTile(props: GameProps) {
  return (
    <div
      className={`${
        props.game.solved
          ? "bg-green-400/30 opacity-60"
          : "bg-gradient-to-b from-gray-300/30 to-gray-400/15"
      } h-min w-min ${props.size <= 1 ? "p-2" : "p-3"} mx-auto mb-3 rounded-md`}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2 px-1">
        {/* <span
          className={`${
            props.size <= 2
              ? "text-[0.65rem]"
              : props.size == 3
                ? "text-xs"
                : "text-sm"
          } text-xl font-black text-red-500`}
        >
          {getWordDifficulty(props.game.answer)}
        </span> */}

        <span
          className={`${
            props.size <= 2
              ? "text-[0.65rem]"
              : props.size == 3
                ? "text-xs"
                : "text-sm"
          } text-gray-400`}
        >
          {(props.index + 1).toString().padStart(4, "0")}
        </span>

        <FontAwesomeIcon
          icon={props.game.solved ? faCheckCircle : faCircle}
          aria-label={props.game.solved ? "Solved" : "Unsolved"}
          className={`${
            props.size <= 2
              ? "text-[0.65rem]"
              : props.size == 3
                ? "text-xs"
                : "text-sm"
          } text-gray-400`}
        />
      </div>

      {props.compactMode ? (
        <>
          <div className="flex w-full items-end justify-between gap-1">
            {/* compact yellow letters */}
            {Array.from({ length: 5 }).map((_, wordPosition) => (
              <div key={wordPosition}>
                <div className="h-min" key={props.game.answer}>
                  {/* if there are yellow letters in this row, show them, 
                  else, put a placeholder element so the yellow letters stay the correct amount apart */}
                  {[...props.game.guessedLetters].filter(
                    (letter) =>
                      letter.setPos === wordPosition && letter.pos === -1,
                  ).length > 0 ? (
                    <div>
                      {[...props.game.guessedLetters]
                        .filter(
                          (letter) =>
                            letter.setPos === wordPosition && letter.pos === -1,
                        )
                        .map((letter, i) => (
                          <Letter
                            key={i}
                            letter={letter.char}
                            size={props.size}
                            guessed={true}
                            phantom={false}
                            typeInKeyboard={props.typeInKeyboard}
                            compactMode={props.compactMode}
                            guessedWordsLength={props.guessedWords.length}
                            className="mx-auto mb-1 bg-yellow-500/60"
                          />
                        ))}
                    </div>
                  ) : (
                    <div
                      className={`invisible mx-auto max-h-0 !border-0 ${getSizeClass(
                        props.size,
                      )}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-x-1">
            {props.game.solved ? (
              <>
                {[...props.game.answer].slice(0, 5).map((char, k) => {
                  return (
                    <Letter
                      key={k}
                      letter={char}
                      size={props.size}
                      guessed={true}
                      phantom={false}
                      typeInKeyboard={props.typeInKeyboard}
                      compactMode={props.compactMode}
                      guessedWordsLength={props.guessedWords.length}
                      className="bg-green-500/60"
                    />
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <>
          {/* entered words rows */}
          {props.guessedWords
            .slice(
              0,
              props.game.solved
                ? props.guessedWords.indexOf(props.game.answer) + 1
                : props.guessedWords.length,
            )
            .map((word, j) => (
              <div className="mb-1 flex gap-x-1" key={j}>
                {[...word].slice(0, 5).map((char, k) => {
                  return (
                    <Letter
                      key={k}
                      letter={char}
                      size={props.size}
                      guessed={true}
                      phantom={false}
                      typeInKeyboard={props.typeInKeyboard}
                      compactMode={props.compactMode}
                      guessedWordsLength={props.guessedWords.length}
                      className={
                        getLetterColor(word, char, k, props.game.answer) ==
                        "green"
                          ? "bg-green-500/60"
                          : getLetterColor(word, char, k, props.game.answer) ==
                              "yellow"
                            ? "bg-yellow-500/60"
                            : getLetterColor(
                                  word,
                                  char,
                                  k,
                                  props.game.answer,
                                ) == "gray"
                              ? "bg-gray-400/60"
                              : "bg-gray-400/60"
                      }
                    />
                  );
                })}
              </div>
            ))}
        </>
      )}

      {/* current word row */}
      <div
        className={`flex gap-x-1 ${
          props.game.solved || props.guessedWords.length == props.MAX_GUESSES
            ? "hidden"
            : ""
        }`}
      >
        {!props.typeInKeyboard
          ? [...props.currentEnteredWord]
              .slice(0, 5)
              .map((char, k) => (
                <Letter
                  key={k}
                  letter={char}
                  guessed={false}
                  phantom={false}
                  typeInKeyboard={props.typeInKeyboard}
                  compactMode={props.compactMode}
                  guessedWordsLength={props.guessedWords.length}
                  size={props.size}
                />
              ))
          : null}
        {!props.typeInKeyboard ||
        props.showPhantoms ||
        props.guessedWords.length < 1
          ? Array.from({
              length: props.typeInKeyboard
                ? 5
                : 5 - props.currentEnteredWord.length,
            }).map((_, k) => (
              <Letter
                key={k}
                letter={
                  props.showPhantoms
                    ? props.game.guessedLetters.find((l) =>
                        !props.typeInKeyboard
                          ? l.pos - props.currentEnteredWord.length === k
                          : l.pos === k,
                      )?.char || ""
                    : ""
                }
                guessed={false}
                phantom={props.showPhantoms}
                typeInKeyboard={props.typeInKeyboard}
                compactMode={props.compactMode}
                guessedWordsLength={props.guessedWords.length}
                size={props.size}
              />
            ))
          : null}
      </div>

      {/* gray letters for compact mode */}
      {props.compactMode &&
      props.game.guessedLetters.filter((g) => g.pos === -2).length > 0 ? (
        <div
          className={`${
            props.size < 2
              ? "mt-1 px-0.5 text-[10px]"
              : props.size == 2
                ? "mt-1 px-0.5 text-xs"
                : props.size == 3
                  ? "mt-2 px-1 text-sm"
                  : "mt-2 px-1 text-base"
          } flex w-full gap-2 font-medium tracking-[0.2em]`}
        >
          <div
            className="flex w-full flex-wrap justify-center gap-1"
            key={props.game.answer}
          >
            {[...props.game.guessedLetters]
              .filter(
                // filters out letters with same character but possibly different placedPosition
                (letter, index, guessedLetters) =>
                  guessedLetters.findIndex((l) => l.char == letter.char) ==
                  index,
              )
              .sort((a, b) => {
                return a.char.localeCompare(b.char);
              })
              .map((letter, i) => (
                <>
                  {letter.pos == -2 ? (
                    <div
                      key={i}
                      className={`flex items-center justify-center bg-gray-400/60 select-none ${
                        props.size < 2
                          ? "h-3 w-3 rounded-xs pl-[0.125rem]"
                          : props.size == 2
                            ? "h-4 w-4 rounded pl-[0.15rem]"
                            : props.size == 3
                              ? "h-5 w-5 rounded-sm pl-[0.1875rem]"
                              : "h-6 w-6 rounded-sm pl-[0.1875rem]"
                      }`}
                    >
                      <span>{letter.char}</span>
                    </div>
                  ) : null}
                </>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      <span
        className={`${
          props.answersVisible ? "mt-2 block" : "hidden"
        } text-sm tracking-widest text-gray-600 italic`}
      >
        {props.game.answer}
      </span>
    </div>
  );
}

const GameGrid = React.memo(function Grid(props: GameGridProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  function moveSolvedToTop(a: Game, b: Game) {
    if (props.moveSolved) {
      return Number(b.solved) - Number(a.solved);
    } else {
      return 0;
    }
  }

  // set width of columns for virtualized masonry grid
  let colWidth: number;
  switch (props.size) {
    case 1:
      colWidth = 95;
      break;
    case 2:
      colWidth = 140;
      break;
    case 3:
      colWidth = 155;
      break;
    case 4:
      colWidth = 200;
      break;
    case 5:
      colWidth = 240;
      break;
    default:
      colWidth = 155;
  }

  return isClient ? (
    // virtualized grid
    <Masonry
      items={[...props.games].sort(moveSolvedToTop)}
      columnGutter={25}
      columnWidth={colWidth}
      overscanBy={2.5}
      className="focus:outline-none"
      render={({ data: game }) => (
        <GameTile
          key={game.answer}
          game={game}
          index={props.answers.indexOf(game.answer)}
          guessedWords={props.guessedWords}
          currentEnteredWord={props.currentEnteredWord}
          MAX_GUESSES={props.MAX_GUESSES}
          size={props.size}
          typeInKeyboard={props.typeInKeyboard}
          compactMode={props.compactMode}
          showPhantoms={props.showPhantoms}
          answersVisible={props.answersVisible}
        />
      )}
    />
  ) : null;
});

export default GameGrid;
