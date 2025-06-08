export type GuessedLetter = {
  char: string;
  pos: number; // position for green, -1 for yellow, -2 for gray
  setPos?: number; // used for yellow and gray letters to indicate the position where they were guessed/placed
};

export type Game = {
  solved: boolean;
  answer: string;
  guessedLetters: GuessedLetter[];
};
