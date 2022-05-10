import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum Instruction {
  SPIN,
  EXCHANGE,
  PARTNER
}

interface FullInstruction {
  instruction: Instruction,
  val1?: number,
  val2?: number,
  program1?: string,
  program2?: string
}

const parseInstructions = (line: string): FullInstruction[] => {
  const instructions = line.trim().split(",")

  return instructions.map(instruction => {
    if (instruction.charAt(0) === "s") {
      return {
        instruction: Instruction.SPIN,
        val1: parseInt(instruction.substring(1)),
      }
    } else {
      const instructionOrder = instruction.charAt(0) === "x" ? Instruction.EXCHANGE : Instruction.PARTNER
      const split = instruction.substring(1).split("/")

      return {
        instruction: instructionOrder,
        val1: instructionOrder === Instruction.EXCHANGE ? parseInt(split[0]) : undefined,
        val2: instructionOrder === Instruction.EXCHANGE ? parseInt(split[1]) : undefined,
        program1: instructionOrder === Instruction.PARTNER ? split[0] : undefined,
        program2: instructionOrder === Instruction.PARTNER ? split[1] : undefined,
      }
    }
  })
}

const applyInstruction = (array: string[], instruction: FullInstruction): string[] => {
  let newArray = []
  switch (instruction.instruction) {
    case Instruction.SPIN:
      newArray = array.slice(array.length - instruction.val1, array.length)
      newArray.push(...array.slice(0, array.length - instruction.val1))
      break
    case Instruction.EXCHANGE:
      newArray = [...array]
      const swap = newArray[instruction.val1]
      newArray[instruction.val1] = newArray[instruction.val2]
      newArray[instruction.val2] = swap
      break
    case Instruction.PARTNER:
      newArray = [...array]
      const indexOfProgram1 = newArray.indexOf(instruction.program1)
      const indexOfProgram2 = newArray.indexOf(instruction.program2)
      const swapPartner = newArray[indexOfProgram1]
      newArray[indexOfProgram1] = newArray[indexOfProgram2]
      newArray[indexOfProgram2] = swapPartner
      break
  }

  return newArray
}

const goA = (input, startArray: string) => {
  const instructions: FullInstruction[] = parseInstructions(input.trim())

  let array = startArray.split("")
  for (let instruction of instructions) {
    array = applyInstruction(array, instruction)
  }

  return array.join("")
}

const goB = (input, startArray: string, totalAmountOfDances: number) => {

  let array = startArray;
  let seenPositions: Map<string, number> = new Map<string, number>();
  seenPositions[array] = 0;

  for(let i = 0; i < totalAmountOfDances; i++) {
    array = goA(input, array)

    if(seenPositions[array] !== undefined) {
      const distance = i - seenPositions[array] + 1;
      i = seenPositions[array] + ((Math.floor(totalAmountOfDances / distance)) * distance) - 1;
      seenPositions = new Map<string, number>();
      // 13 - 50
    } else {
      seenPositions[array] = i;
    }
  }

  return array
}

/* Tests */

test(applyInstruction("abcde".split(""), {
  instruction: Instruction.SPIN,
  val1: 1,
}), "eabcd".split(""))

test(applyInstruction("abcde".split(""), {
  instruction: Instruction.SPIN,
  val1: 3,
}), "cdeab".split(""))

test(applyInstruction("abcde".split(""), {
  instruction: Instruction.SPIN,
  val1: 5,
}), "abcde".split(""))

test(applyInstruction("eabcd".split(""), {
  instruction: Instruction.EXCHANGE,
  val1: 3,
  val2: 4,
}), "eabdc".split(""))

test(applyInstruction("abcde".split(""), {
  instruction: Instruction.EXCHANGE,
  val1: 3,
  val2: 3,
}), "abcde".split(""))

test(applyInstruction("eabdc".split(""), {
  instruction: Instruction.PARTNER,
  program1: "e",
  program2: "b",
}), "baedc".split(""))

test(applyInstruction("abcde".split(""), {
  instruction: Instruction.PARTNER,
  program1: "b",
  program2: "b",
}), "abcde".split(""))

test(goA("s1,x3/4,pe/b", "abcde"), "baedc")
test(goB("s1,x3/4,pe/b", "abcde", 2), "ceadb")

/* Results */

console.time("Time")
const resultA = goA(input, "abcdefghijklmnop")
const resultB = goB(input, "abcdefghijklmnop", 1000000000)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
