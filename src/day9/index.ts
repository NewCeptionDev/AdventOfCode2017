import { readInput, test } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const getRespondingEndChar = (startChar: string): string => {
  switch (startChar) {
    case "{":
      return "}";
    case "[":
      return "]";
    case "<":
      return ">";
  }
}

const getScoreForGroup = (restString: string, depth: number): {score: number, returnIndex: number} => {
  const startChar = restString.charAt(0);
  const endChar = getRespondingEndChar(startChar);
  let score = depth;
  let isGarbage = false;
  let ignoreNext = false;

  for(let i = 1; i < restString.length; i++) {
    if(ignoreNext) {
      ignoreNext = false;
      continue;
    }

    if(restString.charAt(i) === "!") {
      ignoreNext = true;
    } else if(restString.charAt(i) === "<") {
      isGarbage = true;
    } else if(isGarbage && restString.charAt(i) === ">") {
      isGarbage = false;
    } else if(!isGarbage && (restString.charAt(i) === "{" || restString.charAt(i) === "[")) {
      const result = getScoreForGroup(restString.substring(i), depth + 1);
      i =  i + result.returnIndex;
      score += result.score
    } else if(!isGarbage && restString.charAt(i) === endChar) {
      return {
        score: score,
        returnIndex: i
      }
    }
  }
}

const getCountOfGarbageChars = (restString: string): number => {
  let garbageCount = 0;
  let isGarbage = false;
  let ignoreNext = false;

  for(let i = 0; i < restString.length; i++) {
    if(ignoreNext) {
      ignoreNext = false;
      continue;
    }

    if(restString.charAt(i) === "!") {
      ignoreNext = true;
    } else if(!isGarbage && restString.charAt(i) === "<") {
      isGarbage = true;
    } else if(isGarbage && restString.charAt(i) === ">") {
      isGarbage = false;
    } else if(isGarbage) {
      garbageCount++;
    }
  }

  return garbageCount
}

const goA = (input) => {
  return getScoreForGroup(input, 1).score
}

const goB = (input) => {
  return getCountOfGarbageChars(input)
}

/* Tests */

test(getScoreForGroup("{}", 1).score, 1)
test(getScoreForGroup("{{{}}}", 1).score, 6)
test(getScoreForGroup("{{},{}}", 1).score, 5)
test(getScoreForGroup("{{{},{},{{}}}}", 1).score, 16)
test(getScoreForGroup("{<a>, <a>, <a>, <a>}", 1).score, 1)
test(getScoreForGroup("{{<ab>},{<ab>},{<ab>},{<ab>}}", 1).score, 9)
test(getScoreForGroup("{{<!!>},{<!!>},{<!!>},{<!!>}}", 1).score, 9)
test(getScoreForGroup("{{<a!>},{<a!>},{<a!>},{<ab>}}", 1).score, 3)
test(getCountOfGarbageChars("<random characters>"), 17)
test(getCountOfGarbageChars("<<<<>"), 3)
test(getCountOfGarbageChars("<>"), 0)
test(getCountOfGarbageChars("<{!>}>"), 2)
test(getCountOfGarbageChars("<!!>"), 0)
test(getCountOfGarbageChars("<!!!>>"), 0)
test(getCountOfGarbageChars("<{o\"i!a,<{i<a>"), 10)
test(getCountOfGarbageChars("{{<ab>},{<ab>},{<ab>},{<ab>}}"), 8)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
