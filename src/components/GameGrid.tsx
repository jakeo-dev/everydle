import { Masonry } from "masonic";
import { useEffect, useState } from "react";

import Letter from "@/components/Letter";
import React from "react";

import { getLetterColor, getSizeClass } from "@/utility";

import { Game } from "@/types";

type GameGridProps = {
  games: Game[];
  guessedWords: string[];
  currentEnteredWord: string;
  MAX_GUESSES: number;
  size: number;
  typeInKeyboard: boolean;
  compactMode: boolean;
  showPhantoms: boolean;
  answersVisible: boolean;
  moveSolved: boolean;
  virtualize: boolean;
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
};

function GameTile(props: GameProps) {
  return (
    <div
      className={`${
        props.game.solved ? "bg-green-400/30 opacity-60" : "bg-gray-300/30"
      } w-min h-min ${
        props.size <= 1 ? "p-2" : "p-3"
      } gap-3 rounded-md mb-6 mx-auto`}
    >
      {props.compactMode ? (
        <>
          <div className="w-full flex gap-1 justify-between items-end">
            {/* compact yellow letters */}
            {Array.from({ length: 5 }).map((_, wordPosition) => (
              <div key={wordPosition}>
                <div className="h-min" key={props.game.answer}>
                  {/* if there are yellow letters in this row, show them, 
                  else, put a placeholder element so the yellow letters stay the correct amount apart */}
                  {[...props.game.guessedLetters].filter(
                    (letter) =>
                      letter.placedPosition === wordPosition &&
                      letter.position === -1
                  ).length > 0 ? (
                    <div>
                      {[...props.game.guessedLetters]
                        .filter(
                          (letter) =>
                            letter.placedPosition === wordPosition &&
                            letter.position === -1
                        )
                        .map((letter, i) => (
                          <Letter
                            key={i}
                            letter={letter.character}
                            size={props.size}
                            guessed={true}
                            phantom={false}
                            typeInKeyboard={props.typeInKeyboard}
                            compactMode={props.compactMode}
                            guessedWordsLength={props.guessedWords.length}
                            className="bg-yellow-500/60 mx-auto mb-1"
                          />
                        ))}
                    </div>
                  ) : (
                    <div
                      className={`invisible max-h-0 !border-0 mx-auto ${getSizeClass(
                        props.size
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
                : props.guessedWords.length
            )
            .map((word, j) => (
              <div className="flex gap-x-1 mb-1" key={j}>
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
                          : getLetterColor(word, char, k, props.game.answer) ==
                            "gray"
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
                          ? l.position - props.currentEnteredWord.length === k
                          : l.position === k
                      )?.character || ""
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
      props.game.guessedLetters.filter((g) => g.position === -2).length > 0 ? (
        <div
          className={`${
            props.size < 2
              ? "text-[10px] px-0.5 mt-1"
              : props.size == 2
              ? "text-xs px-0.5 mt-1"
              : props.size == 3
              ? "text-sm px-1 mt-2"
              : "text-base px-1 mt-2"
          } flex gap-2 w-full font-medium tracking-[0.2em]`}
        >
          {/* {props.game.guessedLetters.filter((g) => g.position === -1).length >
        0 ? (
          <div
            className="text-yellow-600 w-1/2 text-left wrap-anywhere"
            key={props.game.answer}
          >
            {[...props.game.guessedLetters].sort().map((letter, i) => (
              <span key={i}>
                {letter.position == -1 ? letter.character : ""}
              </span>
            ))}
          </div>
        ) : null} */}
          <div
            className="w-full flex-wrap flex justify-center gap-1"
            key={props.game.answer}
          >
            {[...props.game.guessedLetters]
              .filter(
                // filters out letters with same character but possibly different placedPosition
                (letter, index, guessedLetters) =>
                  guessedLetters.findIndex(
                    (l) => l.character == letter.character
                  ) == index
              )
              .sort((a, b) => {
                return a.character.localeCompare(b.character);
              })
              .map((letter, i) => (
                <>
                  {letter.position == -2 ? (
                    <div
                      key={i}
                      className={`bg-gray-400/60 rounded-sm pl-[0.1875rem] flex justify-center items-center select-none ${
                        props.size < 2
                          ? "w-3 h-3"
                          : props.size == 2
                          ? "w-4 h-4"
                          : props.size == 3
                          ? "w-5 h-5"
                          : "w-6 h-6"
                      }`}
                    >
                      <span>{letter.character}</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      <span
        className={`${
          props.answersVisible ? "block mt-2" : "hidden"
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

  function sortGames(a: Game, b: Game) {
    if (props.moveSolved) {
      return Number(b.solved) - Number(a.solved);
    } else {
      return 0;
    }
  }

  // for virtualized grid
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

  // for normal grid
  let sizeClass: string;
  switch (props.size) {
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

  return isClient ? (
    props.virtualize ? (
      // virtualized grid
      <Masonry
        items={[...props.games].sort(sortGames)}
        columnGutter={15}
        columnWidth={colWidth}
        overscanBy={2.5}
        className="focus:outline-none"
        render={({ data: game }) => (
          <GameTile
            key={game.answer}
            game={game}
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
    ) : (
      // normal grid
      <div
        className={`grid ${sizeClass} justify-items-center align-items-center`}
      >
        {[...props.games].sort(sortGames).map((game) => (
          <GameTile
            key={game.answer}
            game={game}
            guessedWords={props.guessedWords}
            currentEnteredWord={props.currentEnteredWord}
            MAX_GUESSES={props.MAX_GUESSES}
            size={props.size}
            typeInKeyboard={props.typeInKeyboard}
            compactMode={props.compactMode}
            showPhantoms={props.showPhantoms}
            answersVisible={props.answersVisible}
          />
        ))}
      </div>
    )
  ) : null;
});

export default GameGrid;
