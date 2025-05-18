import { Masonry } from "masonic";
import { useEffect, useState } from "react";

import Letter from "@/components/Letter";
import React from "react";

type GameGridProps = {
  games: {
    solved: boolean;
    answer: string;
  }[];
  guessedWords: string[];
  currentEnteredWord: string;
  MAX_GUESSES: number;
  size: number;
  answersVisible: boolean;
  typeInKeyboard: boolean;
  virtualize: boolean;
};

const GameGrid = React.memo(function Grid(props: GameGridProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

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
      <Masonry
        items={props.games}
        columnGutter={15}
        columnWidth={colWidth}
        overscanBy={2.5}
        render={({ index, data: game }) => (
          <div
            key={index}
            className={`${
              game.solved ? "bg-green-300/30" : "bg-gray-300/30"
            } w-min h-min p-3 gap-3 rounded-md mb-6 mx-auto`}
          >
            {/* entered words rows */}
            {props.guessedWords
              .slice(
                0,
                game.solved
                  ? props.guessedWords.indexOf(game.answer) + 1
                  : props.guessedWords.length
              )
              .map((word, j) => (
                <div className="flex gap-x-1 mb-1" key={j}>
                  {[...word].slice(0, 5).map((char, k) => {
                    const isCorrect = char === game.answer[k];
                    const isInAnswer = game.answer.includes(char);
                    const isMisplaced =
                      isInAnswer &&
                      !isCorrect &&
                      !word.slice(0, k).includes(char) && // entered word does NOT contain the character BEFORE this character's position
                      Array.from({ length: 5 }).filter(
                        // the character appears twice in the entered word and the second appearance of the character is in the correct position in the answer
                        (_, i) => word[i] === char && game.answer[i] === char
                      ).length < 1;

                    return (
                      <Letter
                        key={k}
                        letter={char}
                        size={props.size}
                        guessed={true}
                        className={
                          isCorrect
                            ? "bg-green-500/60"
                            : isMisplaced
                            ? "bg-yellow-500/60"
                            : isInAnswer &&
                              (!word.slice(0, k).includes(char) || // entered word does NOT contain the character BEFORE this character's position
                                word.slice(k, 5).includes(char)) && // entered word does NOT contain the character BEFORE this character's position OR entered word DOES contain the character AFTER this character's position
                              game.answer.replaceAll(
                                // character appears more than once in the answer
                                new RegExp(`[^${char}]`, "gi"),
                                ""
                              ).length > 1
                            ? "bg-yellow-500/60"
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
                game.solved || props.guessedWords.length == props.MAX_GUESSES
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
                        size={props.size}
                        className=""
                      />
                    ))
                : null}
              {props.typeInKeyboard && props.guessedWords.length > 0
                ? null
                : Array.from({
                    length: props.typeInKeyboard
                      ? 5
                      : 5 - props.currentEnteredWord.length,
                  }).map((_, k) => (
                    <Letter
                      key={k}
                      letter=""
                      guessed={false}
                      size={props.size}
                      className=""
                    />
                  ))}
            </div>

            <span
              className={`${
                props.answersVisible ? "block mt-2" : "hidden"
              } tracking-wider text-gray-700 italic`}
            >
              {game.answer}
            </span>
          </div>
        )}
      />
    ) : (
      <div
        className={`grid ${sizeClass} justify-items-center align-items-center`}
      >
        {props.games.map((game, index) => (
          <div
            key={index}
            className={`${
              game.solved ? "bg-green-300/30" : "bg-gray-300/30"
            } w-min h-min p-3 gap-3 rounded-md mb-6 mx-auto`}
          >
            {/* entered words rows */}
            {props.guessedWords
              .slice(
                0,
                game.solved
                  ? props.guessedWords.indexOf(game.answer) + 1
                  : props.guessedWords.length
              )
              .map((word, j) => (
                <div className="flex gap-x-1 mb-1" key={j}>
                  {[...word].slice(0, 5).map((char, k) => {
                    const isCorrect = char === game.answer[k];
                    const isInAnswer = game.answer.includes(char);
                    const isMisplaced =
                      isInAnswer &&
                      !isCorrect &&
                      !word.slice(0, k).includes(char) && // entered word does NOT contain the character BEFORE this character's position
                      Array.from({ length: 5 }).filter(
                        // the character appears twice in the entered word and the second appearance of the character is in the correct position in the answer
                        (_, i) => word[i] === char && game.answer[i] === char
                      ).length < 1;

                    return (
                      <Letter
                        key={k}
                        letter={char}
                        size={props.size}
                        guessed={true}
                        className={
                          isCorrect
                            ? "bg-green-500/60"
                            : isMisplaced
                            ? "bg-yellow-500/60"
                            : isInAnswer &&
                              (!word.slice(0, k).includes(char) || // entered word does NOT contain the character BEFORE this character's position
                                word.slice(k, 5).includes(char)) && // entered word does NOT contain the character BEFORE this character's position OR entered word DOES contain the character AFTER this character's position
                              game.answer.replaceAll(
                                // character appears more than once in the answer
                                new RegExp(`[^${char}]`, "gi"),
                                ""
                              ).length > 1
                            ? "bg-yellow-500/60"
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
                game.solved || props.guessedWords.length == props.MAX_GUESSES
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
                        size={props.size}
                        className=""
                      />
                    ))
                : null}
              {props.typeInKeyboard && props.guessedWords.length > 0
                ? null
                : Array.from({
                    length: props.typeInKeyboard
                      ? 5
                      : 5 - props.currentEnteredWord.length,
                  }).map((_, k) => (
                    <Letter
                      key={k}
                      letter=""
                      guessed={false}
                      size={props.size}
                      className=""
                    />
                  ))}
            </div>

            <span
              className={`${
                props.answersVisible ? "block mt-2" : "hidden"
              } tracking-wider text-gray-700 italic`}
            >
              {game.answer}
            </span>
          </div>
        ))}
      </div>
    )
  ) : null;
});

export default GameGrid;
