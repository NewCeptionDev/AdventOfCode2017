import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Position {
  x: number;
  y: number;
}

const findSpiralSquareSize = (searched: number): number => {
  let spiralSquareSize = 1;

  while(spiralSquareSize * spiralSquareSize < searched) {
    spiralSquareSize += 2;
  }

  return spiralSquareSize;
}

const computePosition = (square: number): Position => {
  const correspondingSpiralSquare = findSpiralSquareSize(square);
  const relativeInSpiral = square - ((correspondingSpiralSquare - 2) * (correspondingSpiralSquare - 2))


  if(relativeInSpiral <= correspondingSpiralSquare - 1) {
    return {
      x: Math.floor(correspondingSpiralSquare / 2),
      y: relativeInSpiral - Math.floor(correspondingSpiralSquare / 2)
    }
  } else if(relativeInSpiral <= (correspondingSpiralSquare - 1) * 2) {
    const xValue = ((relativeInSpiral - correspondingSpiralSquare + 1) - Math.floor(correspondingSpiralSquare / 2))
    return {
      x: xValue !== 0 ? -1 * xValue : 0,
      y: Math.floor(correspondingSpiralSquare / 2)
    }
  } else if(relativeInSpiral <= (correspondingSpiralSquare - 1) * 3) {
    const yValue = (relativeInSpiral - ((correspondingSpiralSquare - 1) * 2)) - Math.floor(correspondingSpiralSquare / 2)
    return {
      x: -1 * Math.floor(correspondingSpiralSquare / 2),
      y: yValue !== 0 ? -1 * yValue : 0
    }
  } else {
    return {
      x: (relativeInSpiral - ((correspondingSpiralSquare -1 ) * 3)) - Math.floor(correspondingSpiralSquare / 2),
      y: -1 * Math.floor(correspondingSpiralSquare / 2)
    }
  }
}

const getNeighbourPositions = (position: Position): Position[] => {
  return [{
    x: position.x + 1,
    y: position.y
  },
    {
      x: position.x - 1,
      y: position.y
    }, {
      x: position.x + 1,
      y: position.y + 1
    },
    {
      x: position.x,
      y: position.y + 1
    },{
      x: position.x -1,
      y: position.y + 1
    }, {
      x: position.x + 1,
      y: position.y - 1
    }, {
      x: position.x,
      y: position.y - 1
    }, {
      x: position.x - 1,
      y: position.y - 1
    }];
}

const goA = (input) => {
  const square = parseInt(input.trim())
  const positionOfSquare = computePosition(square);

  return Math.abs(positionOfSquare.x) + Math.abs(positionOfSquare.y)
}

const goB = (input) => {
  const givenSquare = parseInt(input.trim());

  const spiral: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
  spiral[0] = new Map<number, number>();
  spiral[0][0] = 1;

  let lastSum = 0;
  let index = 2;

  while(lastSum < givenSquare) {
    const position = computePosition(index);
    const neighbourPositions = getNeighbourPositions(position);

    let sum = 0;

    for(let neighbour of neighbourPositions) {
      if(spiral[neighbour.y] !== undefined && spiral[neighbour.y][neighbour.x] !== undefined) {
        sum += spiral[neighbour.y][neighbour.x];
      }

    }

    if(spiral[position.y] === undefined){
      spiral[position.y] = new Map<number, number>();
    }

    spiral[position.y][position.x] = sum;
    lastSum = sum;

    index++;
  }

  return lastSum;
}

/* Tests */

test(findSpiralSquareSize(25),5)
test(findSpiralSquareSize(10),5)
test(findSpiralSquareSize(9),3)
test(goB("100"), 122)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
