import { Attempt } from "./attempts";
import * as _ from "lodash";

export type LetterAtIndex = {
  kind: "LETTER_AT_INDEX";
  letter: string;
  index: number;
};

export type LetterNotAtIndex = {
  kind: "LETTER_NOT_AT_INDEX";
  letter: string;
  index: number;
};

export type MinLetterCount = {
  kind: "MIN_LETTER_COUNT";
  letter: string;
  occurrences: number;
};

export type LetterNotPresent = {
  kind: "LETTER_NOT_PRESENT";
  letter: string;
};

export type Hint =
  | LetterAtIndex
  | LetterNotAtIndex
  | MinLetterCount
  | LetterNotPresent;

export const inferHintsFromAttempt = (attempt: Attempt): Hint[] => {
  return attempt.cells.flatMap((cell, index) => {
    const hints: Hint[] = [];
    if (cell.evaluation === "correct") {
      hints.push({
        kind: "LETTER_AT_INDEX",
        letter: cell.letter,
        index,
      });
    }
    if (cell.evaluation === "present") {
      hints.push({
        kind: "LETTER_NOT_AT_INDEX",
        letter: cell.letter,
        index,
      });

      const occurrences = attempt.cells.filter((c) => {
        const isPresent = ["present", "correct"].includes(c.evaluation);
        return c.letter === cell.letter && isPresent;
      }).length;
      hints.push({
        kind: "MIN_LETTER_COUNT",
        letter: cell.letter,
        occurrences,
      });
    }
    if (cell.evaluation === "absent") {
      const anyOtherOccurrenceIsPresent = attempt.cells.some((c) => {
        const isPresent = ["present", "correct"].includes(c.evaluation);
        return c.letter === cell.letter && isPresent;
      });
      if (!anyOtherOccurrenceIsPresent) {
        hints.push({
          kind: "LETTER_NOT_PRESENT",
          letter: cell.letter,
        });
      }
    }
    return _.uniqWith(hints, _.isEqual);
  });
};

export function inferHints(attemptOrAttempts: Attempt | Attempt[]) {
  const hints = _.concat(attemptOrAttempts).flatMap((attempt) =>
    inferHintsFromAttempt(attempt)
  );
  return _.uniqWith(hints, _.isEqual);
}

export const formatHint = (hint: Hint): string => {
  switch (hint.kind) {
    case "LETTER_AT_INDEX":
      return `Letter ${hint.letter} at position ${hint.index + 1}`;
    case "LETTER_NOT_AT_INDEX":
      return `Letter ${hint.letter} NOT at position ${hint.index + 1}`;
    case "LETTER_NOT_PRESENT":
      return `Letter ${hint.letter} is not present`;
    case "MIN_LETTER_COUNT":
      return `Letter ${hint.letter} appears at least ${hint.occurrences} times`;
  }
};

const isCoherentWithHint = (input: string, hint: Hint) => {
  switch (hint.kind) {
    case "LETTER_AT_INDEX":
      return input[hint.index] === hint.letter;
    case "LETTER_NOT_AT_INDEX":
      return input[hint.index] !== hint.letter;
    case "LETTER_NOT_PRESENT":
      return !input.includes(hint.letter);
    case "MIN_LETTER_COUNT":
      const occurrences = (input.match(hint.letter) ?? []).length;
      return occurrences >= hint.occurrences;
  }
};

export const isCoherent = (input: string, hintOrHints: Hint | Hint[]) => {
  return _.concat(hintOrHints).every((hint) => isCoherentWithHint(input, hint));
};
