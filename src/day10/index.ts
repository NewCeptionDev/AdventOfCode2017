import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const reArrangeArray = (array: number[], from: number, length: number): number[] => {
  if(from + length >= array.length) {
    let change = array.slice(from, array.length);
    change.push(...array.slice(0, length - (array.length - from)));
    change.reverse();

    let result = change.slice(array.length - from, change.length);
    result.push(...array.slice(length - (array.length - from), from))
    result.push(...change.slice(0, array.length - from))
    return result
  } else {
    let change = array.slice(from, from + length);
    change.reverse()

    let result = array.slice(0, from);
    result.push(...change);
    result.push(...array.slice(from + length, array.length))
    return result;
  }
}

const goA = (input, arrayLength: number) => {
  const knotList = input.split(",").map(knot => parseInt(knot));
  let currentPosition = 0;
  let skipSize = 0;

  let array: number[] = Array.from(Array(arrayLength).keys())

  for(let knot of knotList) {
    if(knot <= array.length) {
      array = reArrangeArray(array, currentPosition, knot);
      currentPosition = (currentPosition + knot + skipSize) % array.length;
      skipSize++;
    }
  }

  return array[0] * array[1]
}

export const goB = (input, arrayLength: number) => {
  let knotList = input.trim().split("").map(char => char.charCodeAt(0));
  knotList.push(...[17, 31, 73, 47, 23])
  let currentPosition = 0;
  let skipSize = 0;

  let array: number[] = Array.from(Array(arrayLength).keys())

  for(let i = 0; i < 64; i++) {
    for(let knot of knotList) {
      if(knot <= array.length) {
        array = reArrangeArray(array, currentPosition, knot);
        currentPosition = (currentPosition + knot + skipSize) % array.length;
        skipSize++;
      }
    }
  }

  const denseHash: number[] = [];

  for(let i = 0; i < 16; i++) {
    const block = array.slice(i * 16, (i + 1) * 16);

    let result = undefined;

    for(let blockElement of block) {
      if(result === undefined){
        result = blockElement;
      } else {
        result = result ^ blockElement
      }
    }
    denseHash.push(result);
  }

  return denseHash.map(elem => elem.toString(16)).map(elem => elem.length === 1 ? "0" + elem : elem).join("")
}

/* Tests */

test(reArrangeArray([0, 1, 2, 3, 4], 0, 3), [2, 1, 0, 3, 4])
test(reArrangeArray([2, 1, 0, 3, 4], 3, 4), [4, 3, 0, 1, 2])
test(reArrangeArray([4, 3, 0, 1, 2], 3, 1), [4, 3, 0, 1, 2])
test(reArrangeArray([4, 3, 0, 1, 2], 1, 5), [3, 4, 2, 1, 0])
test(goA("3,4,1,5", 5), 12)
test(goB("", 256), "a2582a3a0e66e6e86e3812dcb672a272")
test(goB("AoC 2017", 256), "33efeb34ea91902bb2f59c9920caa6cd")
test(goB("1,2,3", 256), "3efbe78a8d82f29979031a4aa0b16a9d")
test(goB("1,2,4", 256), "63960835bcdc130f0b66d7ff4f6a5a8e")

/* Results */

console.time("Time")
const resultA = goA(input, 256)
const resultB = goB(input, 256)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
