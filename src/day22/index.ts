import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Position {
  x: number,
  y: number
}

enum Direction {
  North,
  South,
  East,
  West
}

const turnRight = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.North:
      return Direction.East;
    case Direction.East:
      return Direction.South;
    case Direction.South:
      return Direction.West;
    case Direction.West:
      return Direction.North;
  }
}

const turnLeft = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.North:
      return Direction.West;
    case Direction.West:
      return Direction.South;
    case Direction.South:
      return Direction.East;
    case Direction.East:
      return Direction.North;
  }
}

const moveForward = (position: Position, direction: Direction): Position => {
  switch (direction) {
    case Direction.North:
      return {
        x: position.x,
        y: position.y - 1
      }
    case Direction.East:
      return {
        x: position.x + 1,
        y: position.y
      }
    case Direction.South:
      return {
        x: position.x,
        y: position.y + 1
      }
    case Direction.West:
      return {
        x: position.x - 1,
        y: position.y
      }
  }
}

enum State {
  Clean,
  Weakened,
  Infected,
  Flagged
}

const goA = (input, numberOfBursts: number) => {
  const lines = splitToLines(input)

  const map: Map<number, Map<number, boolean>> = new Map<number, Map<number, boolean>>()

  for(let i = 0; i < lines.length; i++) {
    map[i] = new Map<number, boolean>();
    for(let j = 0; j < lines[i].length; j++) {
      map[i][j] = lines[i].charAt(j) === "#";
    }
  }

  let position = {
    x: Math.floor(Object.keys(map[0]).length / 2),
    y: Math.floor(Object.keys(map).length/ 2)
  }
  let direction = Direction.North

  let infectedByBurst = 0;

  for(let i = 0; i < numberOfBursts; i++) {
    if(map[position.y] && map[position.y][position.x]){
      direction = turnRight(direction);
    } else {
      direction = turnLeft(direction)
    }

    if(map[position.y] && map[position.y][position.x]){
      map[position.y][position.x] = false;
    } else {
      if(!map[position.y]) {
        map[position.y] = new Map<number, boolean>()
      }
      map[position.y][position.x] = true;
      infectedByBurst++
    }

    position = moveForward(position, direction)
  }

  return infectedByBurst
}

const goB = (input, numberOfBursts: number) => {
  const lines = splitToLines(input)

  const map: Map<number, Map<number, State>> = new Map<number, Map<number, State>>()

  for(let i = 0; i < lines.length; i++) {
    map[i] = new Map<number, boolean>();
    for(let j = 0; j < lines[i].length; j++) {
      map[i][j] = lines[i].charAt(j) === "#" ? State.Infected : State.Clean;
    }
  }

  let position = {
    x: Math.floor(Object.keys(map[0]).length / 2),
    y: Math.floor(Object.keys(map).length/ 2)
  }
  let direction = Direction.North

  let infectedByBurst = 0;

  for(let i = 0; i < numberOfBursts; i++) {
    let stateOfField: State = map[position.y] && map[position.y][position.x] ? map[position.y][position.x] : State.Clean

    switch (stateOfField){
      case State.Clean:
        direction = turnLeft(direction);
        if(!map[position.y]) {
          map[position.y] = new Map<number, boolean>()
        }
        map[position.y][position.x] = State.Weakened;
        break
      case State.Weakened:
        map[position.y][position.x] = State.Infected;
        infectedByBurst++;
        break
      case State.Infected:
        direction = turnRight(direction)
        map[position.y][position.x] = State.Flagged;
        break
      case State.Flagged:
        // Reverse Direction
        direction = turnLeft(turnLeft(direction))
        map[position.y][position.x] = State.Clean;
        break
    }

    position = moveForward(position, direction)
  }

  return infectedByBurst
}

/* Tests */

test(goA(readTestFile(), 70), 41)
test(goB(readTestFile(), 100), 26)

/* Results */

console.time("Time")
const resultA = goA(input, 10000)
const resultB = goB(input, 10000000)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
