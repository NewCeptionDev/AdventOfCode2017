import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const conditionPasses = (condition: string[], register: Map<string, number>): boolean => {

  switch (condition[1]) {
    case "<":
      return register[condition[0]] < parseInt(condition[2]);
    case ">":
      return register[condition[0]] > parseInt(condition[2]);
    case "<=":
      return register[condition[0]] <= parseInt(condition[2]);
    case ">=":
      return register[condition[0]] >= parseInt(condition[2]);
    case "==":
      return register[condition[0]] === parseInt(condition[2]);
    case "!=":
      return register[condition[0]] !== parseInt(condition[2]);
  }

}

const goA = (input) => {
  const lines = splitToLines(input);

  const register: Map<string, number> = new Map<string, number>();

  for(let line of lines) {
    const split = line.split(" ");

    if(register[split[0]] === undefined) {
      register[split[0]] = 0;
    }

    if(register[split[4]] === undefined) {
      register[split[4]] = 0;
    }

    if(conditionPasses(split.slice(4, split.length), register)) {
      if(split[1] === "inc") {
        register[split[0]] += parseInt(split[2])
      } else {
        register[split[0]] -= parseInt(split[2])
      }
    }
  }

  return Object.values(register).sort((a, b) => a - b).pop()
}

const goB = (input) => {
  const lines = splitToLines(input);
  const register: Map<string, number> = new Map<string, number>();
  let highestValueHeld = Number.MIN_SAFE_INTEGER;

  for(let line of lines) {
    const split = line.split(" ");

    if(register[split[0]] === undefined) {
      register[split[0]] = 0;
    }

    if(register[split[4]] === undefined) {
      register[split[4]] = 0;
    }

    if(conditionPasses(split.slice(4, split.length), register)) {
      if(split[1] === "inc") {
        register[split[0]] += parseInt(split[2])
      } else {
        register[split[0]] -= parseInt(split[2])
      }

      if(register[split[0]] > highestValueHeld) {
        highestValueHeld = register[split[0]]
      }
    }
  }

  return highestValueHeld;
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
