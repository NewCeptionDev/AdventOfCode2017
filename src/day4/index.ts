import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

// Taken from https://stackoverflow.com/questions/37579994/generate-permutations-of-javascript-array
const permute = (xs) => {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = permute(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

const goA = (input) => {
  const lines = splitToLines(input);

  let valid = 0;

  for(let line of lines) {
    const words = line.split(" ");
    let validLine = true;

    for(let i = 0; i < words.length && validLine; i++) {
      validLine = words.indexOf(words[i]) === words.lastIndexOf(words[i]);
    }

    if(validLine) {
      valid++;
    }
  }

  return valid
}

const goB = (input) => {
  const lines = splitToLines(input)

  let valid = 0;

  for(let line of lines) {
    const words = line.split(" ");
    let validLine = true;

    for(let i = 0; i < words.length && validLine; i++) {
      const permutations = permute(words[i].split("")).map(permutation =>  permutation.join(""));

      for(let j = 0; j < permutations.length && validLine; j++) {
        validLine = words.indexOf(permutations[j]) === words.lastIndexOf(permutations[j]) && (words.indexOf(permutations[j]) === -1 || words.indexOf(permutations[j]) === i);
      }
    }

    if(validLine) {
      valid++;
    }
  }

  return valid
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
