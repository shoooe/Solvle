import { words } from "./words";
import { getAttempts } from "./attempts";
import { formatHint, inferHints, isCoherent } from "./hints";
import * as _ from "lodash";
import { submitAttempt } from "./actions";

const attempts = getAttempts();
console.log("Attempts: ", attempts);

const hints = inferHints(attempts);
console.log("Hints: ");
hints.forEach((hint) => console.log(formatHint(hint)));

const validWords = words.filter((word) => isCoherent(word, hints));
console.log(`${validWords.length} valid words`);

const nextChoice = _.sample(validWords);
if (!_.isNil(nextChoice)) {
  console.log(`Choosen randomly: ${nextChoice}`);
  submitAttempt(nextChoice);
}
