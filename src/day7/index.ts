import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Program {
  name: string;
  weight: number;
  holding: string[];
  balancedWeight: number;
}

const parseProgram = (programString: string): Program => {
  const informationHoldingSplit = programString.split("->")
  const split = informationHoldingSplit[0].split(" ")

  return {
    name: split[0].trim(),
    weight: parseInt(split[1].substring(1, split[1].length - 1)),
    holding: informationHoldingSplit.length > 1 ? informationHoldingSplit[1].split(", ").map(elem => elem.trim()) : [],
    balancedWeight: -1
  }
}

const goA = (input) => {
  const lines = splitToLines(input)
  const programs = lines.map(line => parseProgram(line))

  return programs.filter(program => programs.every(anotherProgram => !anotherProgram.holding.includes(program.name)))[0].name
}

const goB = (input) => {
  const lines = splitToLines(input)
  const programs = lines.map(line => parseProgram(line))
  const programMap: Map<string, Program> = new Map<string, Program>();

  for(let program of programs) {
    programMap[program.name] = program;
  }

  while(programs.filter(program => program.balancedWeight === -1).length > 0) {
    const changeablePrograms = programs.filter(program => program.balancedWeight === -1 && program.holding.every(holding => programMap[holding].balancedWeight !== -1));

    for(let program of changeablePrograms) {
      if(program.holding.length === 0) {
        program.balancedWeight = 0;
      } else {
        const holdingWeights = program.holding.map(holding => programMap[holding].balancedWeight * programMap[holding].holding.length + programMap[holding].weight);

        let weight = holdingWeights[0];

        for(let i = 1; i < holdingWeights.length; i++) {
          if(holdingWeights[i] !== weight) {
            if(i === 1 && holdingWeights[i] === holdingWeights[2]) {
              const difference = holdingWeights[0] - holdingWeights[i];
              return programMap[program.holding[0]].weight - difference
            }

            const difference = holdingWeights[i] - weight;
            return programMap[program.holding[i]].weight - difference
          }
        }

        program.balancedWeight = weight;
      }
    }
  }

  return 0
}

/* Tests */

test(goA(readTestFile()), "tknk")
test(goB(readTestFile()), 60)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
