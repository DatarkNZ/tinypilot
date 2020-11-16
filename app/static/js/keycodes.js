"use strict";

// Mappings of characters to keycodes that are shared among different keyboard
// layouts.
const commonKeyCodes = {
  "\t": 9,
  "\n": 13,
  " ": 32,
  0: 48,
  ")": 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  $: 52,
  5: 53,
  "%": 53,
  6: 54,
  "^": 54,
  7: 55,
  "&": 55,
  8: 56,
  "*": 56,
  9: 57,
  "(": 57,
  ":": 59,
  ";": 59,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  ",": 188,
  "<": 188,
  ".": 190,
  ">": 190,
  "/": 191,
  "?": 191,
  "[": 219,
  "{": 219,
  "|": 220,
  "]": 221,
  "}": 221,
  "'": 222,
  'Escape': 27,
  'PrintScreen': 44,
  'ScrollLock': 145,
  'Pause': 19,
  'Backspace': 8,
  'Insert': 45,
  'GoHome': 36,
  'PageUp': 33,
  "Tab": 9,
  'Enter': 13,
  'Delete': 46,
  "End": 35,
  "PageDown": 34,
  "CapsLock": 20,
  "Shift": 16,
  "Control": 17,
  "Meta": 102,
  "Alt": 18,
  "ContextMenu": 93,
  "ArrowUp": 38,
  "ArrowLeft": 37,
  "ArrowDown": 40,
  "ArrowRight": 39,
  "f1": 112,
  "f2": 113,
  "f3": 114,
  "f4": 115,
  "f5": 116,
  "f6": 117,
  "f7": 118,
  "f8": 119,
  "f9": 120,
  "f10": 121,
  "f11": 122,
  "f12": 123,
  "undefined": 0
};

// Given a character and a browser language, finds the matching keycode
export function findKeyCode(character, browserLanguage) {
  if (browserLanguage === "en-GB") {
    return findKeyCodeEnGb(character);
  }
  // Default to en-US if no other language matches.
  return findKeyCodeEnUs(character);
}

function joinDictionaries(a, b) {
  return Object.assign({}, a, b);
}

function findKeyCodeEnUs(character) {
  const usSpecificKeys = {
    "!": 49,
    "@": 50,
    "#": 51,
    "+": 187,
    "=": 187,
    "<": 188,
    "-": 189,
    _: 189,
    "~": 192,
    "`": 192,
    "\\": 220,
    '"': 222,
  };
  const lookup = joinDictionaries(commonKeyCodes, usSpecificKeys);
  return lookup[character];
}

function findKeyCodeEnGb(character) {
  const gbSpecificKeys = {
    '"': 50,
    "£": 51,
    "<": 60,
    "+": 61,
    "=": 61,
    "\\": 94,
    "!": 161,
    "~": 163,
    "#": 163,
    "-": 173,
    _: 173,
    "¬": 192,
    "@": 222,
    "`": 223,
    ç: 231,
  };
  const lookup = joinDictionaries(commonKeyCodes, gbSpecificKeys);
  return lookup[character];
}

// This StackOverflow answer says that most browsers represent the Alt Graph
// modifier as ctrlKey = true, altKey = true:
//
//   https://stackoverflow.com/a/18570096/90388
//
// But in my tests, I see all modifiers as false when Alt Graph is pushed.
// The only difference in the onKeyDown event I see is that the key property
// changes when Alt Graph is pushed, so we detect it that way.
export function isAltGraphPressed(browserLanguage, keyCode, key) {
  // Only French AZERTY is supported now.
  // This is not robust, as a user's browser language doesn't necessarily match
  // their keyboard layout.
  if (!browserLanguage.startsWith("fr")) {
    return false;
  }
  return (
    (keyCode === 48 && key === "@") ||
    (keyCode === 50 && key === "~") ||
    (keyCode === 51 && key === "#") ||
    (keyCode === 52 && key === "{") ||
    (keyCode === 53 && key === "[") ||
    (keyCode === 54 && key === "|") ||
    (keyCode === 55 && key === "`") ||
    (keyCode === 56 && key === "\\") ||
    (keyCode === 57 && key === "^") ||
    (keyCode === 61 && key === "}") ||
    (keyCode === 69 && key === "€") ||
    (keyCode === 164 && key === "ø") ||
    (keyCode === 169 && key === "]")
  );
}

// Find correct KeyboardEvent.key value for special keys, otherwise, return
// value passed from on screen keyboard
export function findKeyValue(keyChar){
  const keyMappings = {
    esc: 'Escape',
    print: 'PrintScreen',
    scrolllock: 'ScrollLock',
    pause: 'Pause',
    backspace: 'Backspace',
    insert: 'Insert',
    home: 'GoHome',
    pageup: 'PageUp',
    tab: "Tab",
    enter: 'Enter',
    delete: 'Delete',
    end: "End",
    pagedown: "PageDown",
    capslock: "CapsLock",
    shift: "Shift",
    ctrl: "Control",
    meta: "Meta",
    alt: "Alt",
    space: " ",
    menu: "ContextMenu",
    up: "ArrowUp",
    left: "ArrowLeft",
    down: "ArrowDown",
    right: "ArrowRight"
  }

  return (keyMappings.hasOwnProperty(keyChar)) ? keyMappings[keyChar] : keyChar;

}

// map keys that have different values when shift is pressed to their shifted values
export function getShiftValue(key){
    const shiftMappings = {
      "`": "~",
      1: "!",
      2: "@",
      3: "#",
      4: "$",
      5: "%",
      6: "^",
      7: "&",
      8: "*",
      9: "(",
      0: ")",
      "-": "_",
      "=": "+",
      "[": "{",
      "]": "}",
      "\\": "|",
      ";": ":",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
    }

    return (shiftMappings.hasOwnProperty(key)) ? shiftMappings[key] : key;

}
