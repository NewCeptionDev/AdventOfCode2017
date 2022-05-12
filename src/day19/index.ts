import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum Direction {
  Up,
  Down,
  Left,
  Right
}

interface Position {
  x: number;
  y: number;
}

const findStartPosition = (firstRow: string[]): Position => {
  return {
    x: firstRow.indexOf("|"),
    y: 0,
  }
}

const getNextPositionOnRoad = (map: string[][], position: Position, direction: Direction): { newPosition: Position, newDirection: Direction, visitedChar?: string } => {
  let visitedChar

  if (map[position.y][position.x] === "+") {
    if (direction === Direction.Up || direction === Direction.Down) {
      let newPosition
      let newDirection
      if (map[position.y][position.x + 1] && map[position.y][position.x + 1] !== " " && map[position.y][position.x + 1] !== "|") {
        newPosition = {
          x: position.x + 1,
          y: position.y,
        }
        newDirection = Direction.Right
      } else if (map[position.y][position.x - 1] && map[position.y][position.x - 1] !== " " && map[position.y][position.x - 1] !== "|") {
        newPosition = {
          x: position.x - 1,
          y: position.y,
        }
        newDirection = Direction.Left
      }

      return {
        newPosition: newPosition,
        newDirection: newDirection,
      }
    } else {
      let newPosition
      let newDirection
      if (map[position.y + 1] && map[position.y + 1][position.x] && map[position.y + 1][position.x] !== " " && map[position.y + 1][position.x] !== "-") {
        newPosition = {
          x: position.x,
          y: position.y + 1,
        }
        newDirection = Direction.Down
      } else if (position.y > 0 && map[position.y - 1][position.x] && map[position.y - 1][position.x] !== " " && map[position.y - 1][position.x] !== "-") {
        newPosition = {
          x: position.x,
          y: position.y - 1,
        }
        newDirection = Direction.Up
      }

      return {
        newPosition: newPosition,
        newDirection: newDirection,
      }
    }
  } else if (map[position.y][position.x] && map[position.y][position.x] !== "-" && map[position.y][position.x] !== "|" && map[position.y][position.x] !== " ") {
    visitedChar = map[position.y][position.x]
  }

  let newPosition
  switch (direction) {
    case Direction.Up:
      if (position.y > 0 && map[position.y - 1][position.x] !== " ") {
        newPosition = {
          x: position.x,
          y: position.y - 1,
        }
      }
      break
    case Direction.Down:
      if (map[position.y + 1] && map[position.y + 1][position.x] !== " ") {
        newPosition = {
          x: position.x,
          y: position.y + 1,
        }
      }
      break
    case Direction.Right:
      if (map[position.y][position.x + 1] !== " ") {
        newPosition = {
          x: position.x + 1,
          y: position.y,
        }
      }
      break
    case Direction.Left:
      if (map[position.y][position.x - 1] !== " ") {
        newPosition = {
          x: position.x - 1,
          y: position.y,
        }
      }
      break
  }

  return {
    newPosition: newPosition,
    newDirection: direction,
    visitedChar: visitedChar,
  }
}

const goA = (input) => {
  const lines = splitToLines(input)
  const map: string[][] = lines.map(line => line.split(""))

  let position = findStartPosition(map[0])
  let currentDirection = Direction.Down

  let visitedChars: string[] = [];

  while (position !== undefined){
    const res = getNextPositionOnRoad(map, position, currentDirection)
    position = res.newPosition
    currentDirection = res.newDirection;

    if(res.visitedChar) {
      visitedChars.push(res.visitedChar)
    }
  }

  return visitedChars.join("")
}

const goB = (input) => {
  const lines = splitToLines(input)
  const map: string[][] = lines.map(line => line.split(""))

  let position = findStartPosition(map[0])
  let currentDirection = Direction.Down
  let steps = 0;

  while (position !== undefined){
    const res = getNextPositionOnRoad(map, position, currentDirection)
    position = res.newPosition
    currentDirection = res.newDirection;

    steps++;
  }

  return steps
}

/* Tests */

test(goA(readTestFile()), "ABCDEF")

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
