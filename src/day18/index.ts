import { test, readInput } from "../utils/index"
import { readInputFromSpecialFile, readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum Instruction {
  SND,
  SET,
  ADD,
  MUL,
  MOD,
  RCV,
  JGZ
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
    case "snd":
      return Instruction.SND;
    case "set":
      return Instruction.SET;
    case "add":
      return Instruction.ADD;
    case "mul":
      return Instruction.MUL;
    case "mod":
      return Instruction.MOD;
    case "rcv":
      return Instruction.RCV;
    case "jgz":
      return Instruction.JGZ;
  }
}

const parseFullInstruction = (fullInstruction: string): FullInstruction => {
  const splits = fullInstruction.split(" ");
  const instruction = parseInstruction(splits[0]);

  if(instruction === Instruction.SND || instruction === Instruction.RCV) {
    return {
      instruction: instruction,
      reg1: isNaN(parseInt(splits[1])) ? splits[1] : undefined,
      val1: isNaN(parseInt(splits[1])) ? undefined : parseInt(splits[1])
    }
  } else {
    return {
      instruction: instruction,
      reg1: isNaN(parseInt(splits[1])) ? splits[1] : undefined,
      val1: isNaN(parseInt(splits[1])) ? undefined : parseInt(splits[1]),
      reg2: isNaN(parseInt(splits[2])) ? splits[2] : undefined,
      val2: isNaN(parseInt(splits[2])) ? undefined : parseInt(splits[2]),
    }
  }
}

const applyInstruction = (register: Map<string, number>, queue: number[], instruction: FullInstruction, index: number): {newIndex: number, sentToQueue: number | undefined, waiting: boolean, removedQueueElement: boolean} => {
  let newQueue = undefined;
  let waiting = false;
  let removedQueueElement = false;
  let newIndex = index + 1;

  if(instruction.reg1 !== undefined && register[instruction.reg1] === undefined) {
    register[instruction.reg1] = 0;
  }

  if(instruction.reg2 !== undefined && register[instruction.reg2] === undefined) {
    register[instruction.reg2] = 0;
  }

  switch (instruction.instruction) {
    case Instruction.SND:
      newQueue = instruction.reg1 ? register[instruction.reg1] : instruction.val1;
      break;
    case Instruction.RCV:
      if (queue.length > 0) {
        register[instruction.reg1] = queue[0];
        removedQueueElement = true;
      } else {
        waiting = true;
        newIndex--;
      }
      break;
    case Instruction.SET:
      register[instruction.reg1] = instruction.reg2 !== undefined ? register[instruction.reg2] : instruction.val2;
      break;
    case Instruction.ADD:
      register[instruction.reg1] += instruction.reg2 !== undefined ? register[instruction.reg2] : instruction.val2;
      break;
    case Instruction.MUL:
      register[instruction.reg1] *= instruction.reg2 !== undefined ? register[instruction.reg2] : instruction.val2;
      break;
    case Instruction.MOD:
      register[instruction.reg1] %= instruction.reg2 !== undefined ? register[instruction.reg2] : instruction.val2;
      break;
    case Instruction.JGZ:
      if ((instruction.reg1 !== undefined && register[instruction.reg1] > 0) || (instruction.val1 !== undefined && instruction.val1 > 0)) {
        newIndex = index + (instruction.reg2 !== undefined ? register[instruction.reg2] : instruction.val2)
      }
      break;
  }

  return {newIndex: newIndex, sentToQueue: newQueue, waiting: waiting, removedQueueElement: removedQueueElement};
}

const goA = (input) => {
  const lines = splitToLines(input);
  const instructions = lines.map(line => parseFullInstruction(line));

  const register: Map<string, number> = new Map<string, number>();

  let lastSoundFrequency = -1;

  for(let i = 0; i < instructions.length; i++) {
    if(instructions[i].reg1 !== undefined && register[instructions[i].reg1] === undefined) {
      register[instructions[i].reg1] = 0;
    }

    if(instructions[i].reg2 !== undefined && register[instructions[i].reg2] === undefined) {
      register[instructions[i].reg2] = 0;
    }

    switch (instructions[i].instruction) {
      case Instruction.SND:
        lastSoundFrequency = instructions[i].reg1 ? register[instructions[i].reg1] : instructions[i].val1;
        break;
      case Instruction.RCV:
        if((instructions[i].reg1 !== undefined && register[instructions[i].reg1] !== 0) || (instructions[i].val1 !== undefined && instructions[i].val1 !== 0)) {
          return lastSoundFrequency;
        }
        break;
      case Instruction.SET:
        register[instructions[i].reg1] = instructions[i].reg2 !== undefined ? register[instructions[i].reg2] : instructions[i].val2;
        break;
      case Instruction.ADD:
        register[instructions[i].reg1] += instructions[i].reg2 !== undefined ? register[instructions[i].reg2] : instructions[i].val2;
        break;
      case Instruction.MUL:
        register[instructions[i].reg1] *= instructions[i].reg2 !== undefined ? register[instructions[i].reg2] : instructions[i].val2;
        break;
      case Instruction.MOD:
        register[instructions[i].reg1] %= instructions[i].reg2 !== undefined ? register[instructions[i].reg2] : instructions[i].val2;
        break;
      case Instruction.JGZ:
        if((instructions[i].reg1 !== undefined && register[instructions[i].reg1] > 0) || (instructions[i].val1 !== undefined && instructions[i].val1 > 0)) {
          i += instructions[i].reg2 !== undefined ? register[instructions[i].reg2] - 1 : instructions[i].val2 - 1
        }
        break;
    }
  }
}

const goB = (input) => {
  const lines = splitToLines(input);
  const instructions = lines.map(line => parseFullInstruction(line));

  const registerA: Map<string, number> = new Map<string, number>();
  const registerB: Map<string, number> = new Map<string, number>();

  registerA["p"] = 0;
  registerB["p"] = 1;

  let regAWaiting = false;
  let regBWaiting = false;

  const regAQueue: number[] = [];
  const regBQueue: number[] = [];

  let regAIndex = 0;
  let regBIndex = 0;

  let program1SendCount = 0;


  while(true) {
      const resA = regAIndex < instructions.length ? applyInstruction(registerA, regAQueue, instructions[regAIndex], regAIndex) : {newIndex: regAIndex, removedQueueElement: false, sentToQueue: undefined, waiting: true}
      const resB = regBIndex < instructions.length ? applyInstruction(registerB, regBQueue, instructions[regBIndex], regBIndex) : {newIndex: regBIndex, removedQueueElement: false, sentToQueue: undefined, waiting: true}

      regAIndex = resA.newIndex;
      regBIndex = resB.newIndex;

      if (resB.sentToQueue) {
        program1SendCount++;
        regAQueue.push(resB.sentToQueue)
      }

      if(resA.sentToQueue) {
        regBQueue.push(resA.sentToQueue)
      }

      if(resA.removedQueueElement) {
        regAQueue.splice(0, 1)
      }

      if(resB.removedQueueElement) {
        regBQueue.splice(0, 1)
      }

      if (resA.waiting && resB.waiting) {
        break;
      }
  }

  return program1SendCount
}

/* Tests */

test(goA(readTestFile()), 4)
test(goB(readInputFromSpecialFile("testInput2.txt")), 3)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
