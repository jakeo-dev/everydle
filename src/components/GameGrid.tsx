import { Masonry } from "masonic";
import { useEffect, useState } from "react";

import Letter from "@/components/Letter";
import React from "react";
import { getLetterColor } from "@/utility";

type Game = {
  solved: boolean;
  answer: string;
  guessedLetters: { character: string; position: number }[];
};

type GameGridProps = {
  games: Game[];
  guessedWords: string[];
  currentEnteredWord: string;
  MAX_GUESSES: number;
  size: number;
  typeInKeyboard: boolean;
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
  showPhantoms: boolean;
  answersVisible: boolean;
  game: Game;
};

function Game(props: GameProps) {
  return (
    <div
      className={`${
        props.game.solved ? "bg-green-400/30 opacity-60" : "bg-gray-300/30"
      } w-min h-min ${
        props.size <= 1 ? "p-2" : "p-3"
      } gap-3 rounded-md mb-6 mx-auto`}
    >
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
                  className={
                    getLetterColor(word, char, k, props.game.answer) == "green"
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
                  size={props.size}
                />
              ))
          : null}
        {Array.from({
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
            size={props.size}
          />
        ))}
      </div>

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
        render={({ data: game }) => (
          <Game
            key={game.answer}
            game={game}
            guessedWords={props.guessedWords}
            currentEnteredWord={props.currentEnteredWord}
            MAX_GUESSES={props.MAX_GUESSES}
            size={props.size}
            typeInKeyboard={props.typeInKeyboard}
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
          <Game
            key={game.answer}
            game={game}
            guessedWords={props.guessedWords}
            currentEnteredWord={props.currentEnteredWord}
            MAX_GUESSES={props.MAX_GUESSES}
            size={props.size}
            typeInKeyboard={props.typeInKeyboard}
            showPhantoms={props.showPhantoms}
            answersVisible={props.answersVisible}
          />
        ))}
      </div>
    )
  ) : null;
});

export default GameGrid;
