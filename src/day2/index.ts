import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  const lines = splitToLines(input);

  let checksum = 0;

  for(let line of lines) {
    const numbers = line.trim().split("\t").map(number => parseInt(number));

    let lowest = Number.MAX_SAFE_INTEGER;
    let highest = Number.MIN_SAFE_INTEGER;

    for(let number of numbers) {
      if(number > highest) {
        highest = number;
      }

      if(number < lowest) {
        lowest = number;
      }
    }

    checksum += highest - lowest;
  }

  return checksum
}

const goB = (input) => {
  const lines = splitToLines(input);

  let sum = 0;

  for(let line of lines) {
    const numbers = line.trim().split("\t").map(number => parseInt(number));

    let foundDividable = false;

    for(let i = 0; i < numbers.length && !foundDividable; i++) {
      for (let j = 0; j < numbers.length && !foundDividable; j++) {
        if (i !== j && (numbers[i] / numbers[j]) % 1 === 0) {
          sum += numbers[i] / numbers[j];
          foundDividable = true;
        }
      }
    }
  }

  return sum
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
