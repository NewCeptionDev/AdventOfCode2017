import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const max16BitVal = 65535;

const genAFactor = 16807;
const genBFactor = 48271;

const calculateNextInput = (lastValue: number, factor: number): number => {
  return (lastValue * factor) % 2147483647;
}

const findNextValueMeetingCriteria = (lastValue: number, factor: number, criteria: (value) => boolean): number => {
  let nextValue = calculateNextInput(lastValue, factor);

  while (!criteria(nextValue)) {
    nextValue = calculateNextInput(nextValue, factor);
  }

  return nextValue;
}

const goA = (input) => {
  const lines = splitToLines(input);

  const genAStartValue = parseInt(lines[0].split(" ").pop())
  const genBStartValue = parseInt(lines[1].split(" ").pop())

  let genAVal: number = undefined;
  let genBVal: number = undefined;

  let equalEnds = 0;

  for(let i = 0; i < 40000000; i++) {
    genAVal = calculateNextInput(genAVal !== undefined ? genAVal : genAStartValue, genAFactor)
    genBVal = calculateNextInput(genBVal !== undefined ? genBVal : genBStartValue, genBFactor)

    if((genAVal & max16BitVal) === (genBVal & max16BitVal)) {
      equalEnds++;
    }
  }

  return equalEnds;
}

const goB = (input) => {
  const lines = splitToLines(input);

  const genAStartValue = parseInt(lines[0].split(" ").pop())
  const genBStartValue = parseInt(lines[1].split(" ").pop())

  let genAVal: number = undefined;
  let genBVal: number = undefined;

  let equalEnds = 0;

  for(let i = 0; i < 5000000; i++) {
    genAVal = findNextValueMeetingCriteria(genAVal !== undefined ? genAVal : genAStartValue, genAFactor, value => value % 4 === 0)
    genBVal = findNextValueMeetingCriteria(genBVal !== undefined ? genBVal : genBStartValue, genBFactor, value => value % 8 === 0)

    if((genAVal & max16BitVal) === (genBVal & max16BitVal)) {
      equalEnds++;
    }
  }

  return equalEnds;
}

/* Tests */

test(calculateNextInput(65, genAFactor), 1092455)
test(calculateNextInput(8921, genBFactor), 430625591)
test(goA("65\r\n8921"), 588)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
