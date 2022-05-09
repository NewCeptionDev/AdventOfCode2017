import { test, readInput } from "../utils/index"
import { goB as calculateKnotHash } from "../day10/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Position {
  x: number;
  y: number;
}

const transformHexadecimalToBitArray = (hexadecimal: string): number[] => {
  const bitArray = [];

  for(let i = 0; i < hexadecimal.length; i++) {
    const newBits = parseInt(hexadecimal.charAt(i), 16).toString(2).split("").map(elem => parseInt(elem));
    while(newBits.length < 4) {
      newBits.unshift(0)
    }

    bitArray.push(...newBits)
  }

  return bitArray;
}

const goA = (input) => {
  const keyString = input.trim();

  const grid: number[][] = [];

  for(let i = 0; i < 128; i++) {
    grid.push(transformHexadecimalToBitArray(calculateKnotHash(keyString + "-" + i, 256)))
  }

  let usedSpace = 0;

  for(let y = 0; y < grid.length; y++) {
    usedSpace += grid[y].reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  return usedSpace
}

const goB = (input) => {
  const keyString = input.trim();

  const grid: number[][] = [];

  for(let i = 0; i < 128; i++) {
    grid.push(transformHexadecimalToBitArray(calculateKnotHash(keyString + "-" + i, 256)))
  }

  const usedPositions: Position[] = [];

  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      if(grid[y][x] === 1) {
        usedPositions.push({x: x, y: y})
      }
    }
  }

  let areas = 0;

  while (usedPositions.length > 0) {
    let currentAreaCheck = [usedPositions.pop()];
    areas++;

    while(currentAreaCheck.length > 0) {
      const visited = currentAreaCheck.pop();
      const neighbours = [{x: visited.x + 1, y: visited.y}, {x: visited.x - 1, y: visited.y}, {x: visited.x, y: visited.y + 1}, {x: visited.x, y: visited.y - 1}]

      for(let neighbour of neighbours) {
        const indexInUsed = usedPositions.findIndex(position => position.x === neighbour.x && position.y === neighbour.y);
        if(indexInUsed >= 0) {
          currentAreaCheck.push(neighbour);
          usedPositions.splice(indexInUsed, 1);
        }
      }
    }
  }

  return areas
}

/* Tests */

test(transformHexadecimalToBitArray("0"), [0,0,0,0])
test(transformHexadecimalToBitArray("1"), [0,0,0,1])
test(transformHexadecimalToBitArray("01"), [0,0,0,0,0,0,0,1])

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
