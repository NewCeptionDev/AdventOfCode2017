import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  const lines = splitToLines(input).map(line => parseInt(line.trim()));

  let steps = 0;

  for(let i = 0; i < lines.length; i++) {
    lines[i] = lines[i] + 1;
    i = i + lines[i] - 2;

    steps++;
  }

  return steps
}

const goB = (input) => {
  const lines = splitToLines(input).map(line => parseInt(line.trim()));

  let steps = 0;

  for(let i = 0; i < lines.length; i++) {
    const jumpRange = lines[i];

    if(lines[i] >= 3) {
      lines[i] = lines[i] - 1;
    } else {
      lines[i] = lines[i] + 1;
    }

    i = i + jumpRange - 1;

    steps++;
  }

  return steps
}

/* Tests */

test(goA(readTestFile()), 5)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
