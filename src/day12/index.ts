import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Program {
  id: number,
  connected: number[]
}

const parseProgram = (line: string): Program => {
  const split = line.split("<->")

  return {
    id: parseInt(split[0]),
    connected: split[1].split(", ").map(elem => elem.trim()).map(elem => parseInt(elem))
  }
}

const findFullGroupStartingWith = (startProgramId: number, programs: Map<number, Program>): number[] => {
  const connectedPrograms = []
  let toVisit = [startProgramId]

  for(let programId of toVisit) {
    const program = programs[programId];

    for(let connected of program.connected) {
      if(!connectedPrograms.includes(connected)) {
        connectedPrograms.push(connected);
        toVisit.push(connected)
      }
    }
  }

  return connectedPrograms;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const programs = lines.map(line => parseProgram(line))

  const programMap: Map<number, Program> = new Map<number, Program>();

  for(let program of programs) {
    programMap[program.id] = program;
  }

  return findFullGroupStartingWith(0, programMap).length
}

const goB = (input) => {
  const lines = splitToLines(input);
  const programs = lines.map(line => parseProgram(line))

  const programMap: Map<number, Program> = new Map<number, Program>();

  for(let program of programs) {
    programMap[program.id] = program;
  }

  let notConnected = [...programs];
  let groups = 0;

  while(notConnected.length > 0) {
    const startPoint = notConnected[0];

    const group = findFullGroupStartingWith(startPoint.id, programMap);
    groups++;

    notConnected = notConnected.filter(program => !group.includes(program.id))
  }

  return groups
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
