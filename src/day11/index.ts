import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum DIRECTION {
  NORTH,
  NORTH_EAST,
  SOUTH_EAST,
  SOUTH,
  SOUTH_WEST,
  NORTH_WEST
}

interface Position {
  x: number,
  y: number
}

const parseDirection = (direction: string): DIRECTION => {
  switch (direction) {
    case "n":
      return DIRECTION.NORTH;
    case "ne":
      return DIRECTION.NORTH_EAST;
    case "se":
      return DIRECTION.SOUTH_EAST;
    case "s":
      return DIRECTION.SOUTH;
    case "sw":
      return DIRECTION.SOUTH_WEST;
    case "nw":
      return DIRECTION.NORTH_WEST
  }
}

const move = (position: Position, direction: DIRECTION): Position => {
  switch (direction) {
    case DIRECTION.NORTH:
      return {
        x: position.x,
        y: position.y - 1
      }
    case DIRECTION.NORTH_EAST:
      return {
        x: position.x + 0.5,
        y: position.y - 0.5
      }
    case DIRECTION.SOUTH_EAST:
      return {
        x: position.x + 0.5,
        y: position.y + 0.5
      }
    case DIRECTION.SOUTH:
      return {
        x: position.x,
        y: position.y + 1
      }
    case DIRECTION.SOUTH_WEST:
      return {
        x: position.x - 0.5,
        y: position.y + 0.5
      }
    case DIRECTION.NORTH_WEST:
      return {
        x: position.x - 0.5,
        y: position.y - 0.5
      }
  }
}

const goA = (input) => {
  const directions = input.trim().split(",").map(direction => parseDirection(direction));

  let position: Position = {
    x: 0,
    y: 0
  }

  for(let direction of directions) {
    position = move(position, direction)
  }

  return Math.abs(position.x) + Math.abs(position.y)
}

const goB = (input) => {
  const directions = input.trim().split(",").map(direction => parseDirection(direction));

  let furthestDistance: number = Number.MIN_SAFE_INTEGER;

  let position: Position = {
    x: 0,
    y: 0
  }

  for(let direction of directions) {
    position = move(position, direction)
    const distance = Math.abs(position.x) + Math.abs(position.y)

    if(distance > furthestDistance) {
      furthestDistance = distance;
    }
  }

  return furthestDistance
}

/* Tests */

test(goA("ne,ne,ne"), 3)
test(goA("ne,ne,sw,sw"), 0)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
