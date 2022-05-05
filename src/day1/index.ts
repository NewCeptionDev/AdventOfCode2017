import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  const trimInput = input.trim()
  let sum = 0;

  for(let i = 0; i < trimInput.length; i++) {
    if(i + 1 === trimInput.length) {
      sum += trimInput.charAt(0) === trimInput.charAt(i) ? parseInt(trimInput.charAt(i)) : 0
    } else {
      sum += trimInput.charAt(i) === trimInput.charAt(i + 1) ? parseInt(trimInput.charAt(i)) : 0
    }
  }

  return sum;
}

const goB = (input) => {
  const trimInput = input.trim()
  let sum = 0;

  for(let i = 0; i < trimInput.length; i++) {
    const halfwayAround = (i + (trimInput.length / 2)) % trimInput.length

    sum += trimInput.charAt(i) === trimInput.charAt(halfwayAround) ? parseInt(trimInput.charAt(i)) : 0
  }

  return sum;
}

/* Tests */

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
