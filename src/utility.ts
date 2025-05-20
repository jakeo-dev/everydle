/**
 * Gets the color of a letter
 *
 * @param {string} enteredWord - The entered word
 * @param {string} char - Character in entered word
 * @param {number} pos - Position of the character in the entered word
 * @param {string} gameAnswer - Game answer
 * @returns {string} - Name of the color: green, yellow, or gray
 */
export function getLetterColor(
  enteredWord: string,
  char: string,
  pos: number,
  gameAnswer: string
): string {
  const isCorrect = char === gameAnswer[pos];
  const isInAnswer = gameAnswer.includes(char);
  const isMisplaced =
    isInAnswer &&
    !isCorrect &&
    !enteredWord.slice(0, pos).includes(char) && // entered word does NOT contain the character BEFORE this character's position
    Array.from({ length: 5 }).filter(
      // the character appears twice in the entered word and the second appearance of the character is in the correct position in the answer
      (_, i) => enteredWord[i] === char && gameAnswer[i] === char
    ).length < 1;

  if (isCorrect) return "green";
  else if (isMisplaced) return "yellow";
  else if (
    isInAnswer &&
    (!enteredWord.slice(0, pos).includes(char) || // entered word does NOT contain the character BEFORE this character's position
      enteredWord.slice(pos, 5).includes(char)) && // entered word does NOT contain the character BEFORE this character's position OR entered word DOES contain the character AFTER this character's position
    gameAnswer.replaceAll(
      // character appears more than once in the answer
      new RegExp(`[^${char}]`, "gi"),
      ""
    ).length > 1
  )
    return "yellow";
  else return "gray";
}
