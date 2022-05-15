import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

/*
 * The Input was custom written using the following Pattern:
 *
 * First Line: Steps till diagnostic checksum
 * Second Line: Empty
 * From Third Line: Letter of State - Value Written for 0, Movement Direction, Next State - Value Written for 1, Movement Direction, Next State
 *
 * From the Example: Begin in state A.
 *                   Perform a diagnostic checksum after 6 steps.
 *
 *                   In state A:
 *                    If the current value is 0:
 *                      - Write the value 1.
 *                      - Move one slot to the right.
 *                      - Continue with state B.
 *                    If the current value is 1:
 *                      - Write the value 0.
 *                      - Move one slot to the left.
 *                      -  Continue with state B.
 *
 * Translates to: 6
 *
 *                A - 1,R,B - 0,L,B
 *
 */

const input = prepareInput(readInput())

interface State {
  name: string,
  zeroWrite: number,
  zeroMoveRight: boolean,
  zeroNextState: string,
  oneWrite: number,
  oneMoveRight: boolean,
  oneNextState: string
}

const parseState = (line: string) => {
  const split = line.split("-")
  const zeroPart = split[1].split(",")
  const onePart = split[2].split(",")

  return {
    name: split[0].trim(),
    zeroWrite: parseInt(zeroPart[0].trim()),
    zeroMoveRight: zeroPart[1] === "R",
    zeroNextState: zeroPart[2].trim(),
    oneWrite: parseInt(onePart[0].trim()),
    oneMoveRight: onePart[1] === "R",
    oneNextState: onePart[2].trim(),
  }
}

const goA = (input) => {
  const lines = splitToLines(input);

  const steps = parseInt(lines[0].trim())
  const states: State[] = lines.slice(1, lines.length).map(line => parseState(line));

  const register: Map<number, number> = new Map<number, number>()
  let cursor = 0;
  let currentState = "A";

  for(let i = 0; i < steps; i++) {
    if(!register[cursor]) {
      register[cursor] = 0;
    }

    let state = states.find(correctState => correctState.name === currentState)

    if(register[cursor] === 0) {
      register[cursor] = state.zeroWrite
      cursor += state.zeroMoveRight ? 1 : -1
      currentState = state.zeroNextState
    } else {
      register[cursor] = state.oneWrite
      cursor += state.oneMoveRight ? 1 : -1
      currentState = state.oneNextState
    }
  }

  return Object.values(register).reduce((previousValue, currentValue) => previousValue + currentValue)
}

const goB = (input) => {
  return
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
