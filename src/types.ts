export type GuessedLetter = {
  character: string;
  position: number; // position for green, -1 for yellow, -2 for gray
  placedPosition?: number; // used for yellow and gray letters to indicate the position where they were guessed
};

export type Game = {
  solved: boolean;
  answer: string;
  guessedLetters: GuessedLetter[];
};
