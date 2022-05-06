import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const getIndexOfHighestBlockCount = (blocks: number[]): number => {
  let highest = -1;
  let highestIndex = -1;

  for(let i = 0; i < blocks.length; i++) {
    if(blocks[i] > highest) {
      highest = blocks[i];
      highestIndex = i;
    }
  }

  return highestIndex;
}

const goA = (input) => {
  const blocks = input.trim().split("\t").map(part => parseInt(part));
  const knownConfigurations: string[] = [];

  let configuration = blocks;

  while(!knownConfigurations.includes(configuration.join(","))) {
    knownConfigurations.push(configuration.join(","))

    const highestIndex = getIndexOfHighestBlockCount(configuration);

    const toDistribute = configuration[highestIndex];
    configuration[highestIndex] = 0;

    const distributeForAll = Math.floor(toDistribute / configuration.length);
    let remaining = toDistribute - (distributeForAll * configuration.length);

    let index = highestIndex + 1;

    do {
      if(index === configuration.length) {
        index = 0;
      }

      configuration[index] += distributeForAll;

      if(remaining > 0) {
        configuration[index]++;
        remaining--;
      }

      index++;
    } while (index !== highestIndex + 1)
  }

  return knownConfigurations.length
}

const goB = (input) => {
  const blocks = input.trim().split("\t").map(part => parseInt(part));
  const knownConfigurations: string[] = [];

  let configuration = blocks;

  while(!knownConfigurations.includes(configuration.join(","))) {
    knownConfigurations.push(configuration.join(","))

    const highestIndex = getIndexOfHighestBlockCount(configuration);

    const toDistribute = configuration[highestIndex];
    configuration[highestIndex] = 0;

    const distributeForAll = Math.floor(toDistribute / configuration.length);
    let remaining = toDistribute - (distributeForAll * configuration.length);

    let index = highestIndex + 1;

    do {
      if(index === configuration.length) {
        index = 0;
      }

      configuration[index] += distributeForAll;

      if(remaining > 0) {
        configuration[index]++;
        remaining--;
      }

      index++;
    } while (index !== highestIndex + 1)
  }

  return knownConfigurations.length - knownConfigurations.indexOf(configuration.join(","))
}

/* Tests */

test(goA("0\t2\t7\t0"), 5)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
