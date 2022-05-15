import { test, readInput } from "../utils/index"
import { readInputFromSpecialFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum Instruction {
  SET,
  SUB,
  MUL,
  JNZ
}

interface FullInstruction {
  instruction: Instruction;
  reg1?: string;
  reg2?: string;
  val1?: number;
  val2?: number;
}

const parseInstruction = (instruction: string): Instruction => {
  switch (instruction) {
    case "set":
      return Instruction.SET
    case "sub":
      return Instruction.SUB
    case "mul":
      return Instruction.MUL
    case "jnz":
      return Instruction.JNZ
  }
}

const parseFullInstruction = (fullInstruction: string): FullInstruction => {
  const splits = fullInstruction.split(" ")
  const instruction = parseInstruction(splits[0])

  return {
    instruction: instruction,
    reg1: isNaN(parseInt(splits[1])) ? splits[1] : undefined,
    val1: isNaN(parseInt(splits[1])) ? undefined : parseInt(splits[1]),
    reg2: isNaN(parseInt(splits[2])) ? splits[2] : undefined,
    val2: isNaN(parseInt(splits[2])) ? undefined : parseInt(splits[2]),
  }
}

const goA = (input) => {
  const lines = splitToLines(input)
  const instructions = lines.map(line => parseFullInstruction(line))

  const register: Map<string, number> = new Map<string, number>()

  let countOfMulOperations = 0

  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].reg1 !== undefined && register[instructions[i].reg1] === undefined) {
      register[instructions[i].reg1] = 0
    }

    if (instructions[i].reg2 !== undefined && register[instructions[i].reg2] === undefined) {
      register[instructions[i].reg2] = 0
    }

    switch (instructions[i].instruction) {
      case Instruction.SET:
        register[instructions[i].reg1] = instructions[i].reg2 !== undefined ? register[instructions[i].reg2] : instructions[i].val2
        break
      case Instruction.SUB:
        register[instructions[i].reg1] -= instructions[i].reg2 !== undefined ? register[instructions[i].reg2] : instructions[i].val2
        break
      case Instruction.MUL:
        register[instructions[i].reg1] *= instructions[i].reg2 !== undefined ? register[instructions[i].reg2] : instructions[i].val2
        countOfMulOperations++
        break
      case Instruction.JNZ:
        if ((instructions[i].reg1 !== undefined && register[instructions[i].reg1] !== 0) || (instructions[i].val1 !== undefined && instructions[i].val1 !== 0)) {
          i += instructions[i].reg2 !== undefined ? register[instructions[i].reg2] - 1 : instructions[i].val2 - 1
        }
        break
    }
  }

  return countOfMulOperations
}

const goB = (input) => {
  const lines = splitToLines(input)
  const instructions = lines.map(line => parseFullInstruction(line))

  const b = instructions[0].val2 * 100 + 100000

  let nonPrimes = 0
  for (let n = b; n <= b + 17000; n += 17) {
    let d = 2
    while (n % d !== 0) {
      d++
    }
    if (n !== d) {
      nonPrimes++
    }
  }

  return nonPrimes
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
