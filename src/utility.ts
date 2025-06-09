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
  gameAnswer: string,
): string {
  const isCorrect = char === gameAnswer[pos];
  const isInAnswer = gameAnswer.includes(char);
  const isMisplaced =
    isInAnswer &&
    !isCorrect &&
    !enteredWord.slice(0, pos).includes(char) && // entered word does NOT contain the character BEFORE this character's position
    Array.from({ length: 5 }).filter(
      // the character appears twice in the entered word and the second appearance of the character is in the correct position in the answer
      (_, i) => enteredWord[i] === char && gameAnswer[i] === char,
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
      "",
    ).length > 1
  )
    return "yellow";
  else return "gray";
}

/**
 * Removes duplicate elements from an array
 *
 * @param {Array} array - original array with potential duplicates
 * @returns {Array} - array with duplicates removed
 */
export function removeDuplicates<T>(array: Array<T>): Array<T> {
  // https://stackoverflow.com/a/9229821
  return [...new Set(array)];
}

/**
 * Removes duplicate elements from an array
 *
 * @param {number} size - number 1-5 representing size
 * @returns {string} - class name corresponding letter sizes
 */
export function getSizeClass(size: number): string {
  switch (size) {
    case 1:
      return "w-3 h-3 text-[10px] rounded-xs border-[1.5px]";
    case 2:
      return "w-5 h-5 text-base rounded border-[1.75px]";
    case 3:
      return "w-6 h-6 text-lg rounded-sm border-2";
    case 4:
      return "w-8 h-8 text-xl rounded-sm border-2";
    case 5:
      return "w-10 h-10 text-2xl rounded-sm border-2";
    default:
      return "w-6 h-6 text-lg rounded-sm border-2";
  }
}
