import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  const stepping = parseInt(input.trim())

  let buffer = [0]

  let insertIndex = 0

  for (let i = 1; i <= 2017; i++) {
    const realStepping = buffer.length === 1 ? 1 : stepping % buffer.length
    insertIndex = insertIndex + realStepping > buffer.length ? insertIndex + realStepping - buffer.length : insertIndex + realStepping

    buffer.splice(insertIndex, 0, i)
    insertIndex++
  }

  return buffer[buffer.indexOf(2017) + 1 === buffer.length ? 0 : buffer.indexOf(2017) + 1]
}

const goB = (input, rounds: number) => {
  const stepping = parseInt(input.trim())

  let insertIndex = 0

  let lastInsert = -1;

  for (let i = 1; i <= rounds; i++) {
    const realStepping = i === 1 ? 1 : stepping % i
    insertIndex = insertIndex + realStepping > i ? insertIndex + realStepping - i : insertIndex + realStepping

    if(insertIndex === 1) {
      lastInsert = i;
    }

    insertIndex++
  }

  return lastInsert
}

/* Tests */

test(goB("3", 4), 2)
test(goB("3", 5), 5)
test(goB("3", 8), 5)
test(goB("3", 9), 9)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input, 50000000)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
