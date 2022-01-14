import * as _ from "lodash";

const SUBMIT = "↵";
const CANCEL = "←";

const pressKey = (key: string) => {
  const buttonNodes = document
    ?.querySelector("game-app")
    ?.shadowRoot?.querySelector("game-theme-manager game-keyboard")
    ?.shadowRoot?.querySelectorAll("button");
  if (buttonNodes === undefined) throw Error("Can't read keyboard keys");
  const buttons = Array.from(buttonNodes);
  const target = buttons.find((x) => x.getAttribute("data-key") === key);
  if (target === undefined) throw new Error("Can't find keyboard key");
  target.click();
};

const throttlePressKeys = (keys: string[], msDelay = 300) => {
  if (keys.length === 0) return;
  const [next, ...rest] = keys;
  setTimeout(() => {
    pressKey(next);
    throttlePressKeys(rest, msDelay);
  }, msDelay);
};

export const submitAttempt = (input: string) => {
  const prefix = _.range(0, 5).map(() => CANCEL); // clear any existing attempts
  const chars = input.split("");
  const postfix = SUBMIT;
  const keys = _.concat(prefix, chars, postfix);
  throttlePressKeys(keys);
};
