import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Rule {
  from: string,
  to: string
}

const parseRule = (line: string): Rule => {
  const split = line.split("=>")

  return {
    from: split[0].trim(),
    to: split[1].trim(),
  }
}

const convertSquareToString = (square: string[]): string => {
  return square.join("/")
}

const convertSquareStringToSquare = (squareString: string): string[] => {
  return squareString.split("/")
}

const splitSquareInSmallSquares = (square: string[]): string[] => {
  // console.log("sqaure to split", square)
  const smallSquares: string[] = []
  if (square.length % 2 === 0) {
    for (let y = 0; y < square.length; y += 2) {
      for (let x = 0; x < square.length; x += 2) {
        smallSquares.push(square[y].charAt(x) + square[y].charAt(x + 1) + "/" + square[y + 1].charAt(x) + square[y + 1].charAt(x + 1))
      }
    }
  } else {
    for (let y = 0; y < square.length; y += 3) {
      for (let x = 0; x < square.length; x += 3) {
        smallSquares.push(square[y].charAt(x) + square[y].charAt(x + 1) + square[y].charAt(x + 2) + "/" + square[y + 1].charAt(x) + square[y + 1].charAt(x + 1) + square[y + 1].charAt(x + 2) + "/" + square[y + 2].charAt(x) + square[y + 2].charAt(x + 1) + square[y + 2].charAt(x + 2))
      }
    }
  }

  return smallSquares
}

const getAllRotationsOfSquare = (square: string[]): string[] => {
  let rotations: string[] = [convertSquareToString(square)]
  if (square.length === 2) {
    rotations.push(square[0].charAt(1) + square[0].charAt(0) + "/" + square[1].charAt(1) + square[1].charAt(0))
    rotations.push(square[1].charAt(0) + square[0].charAt(0) + "/" + square[1].charAt(1) + square[0].charAt(1))
    rotations.push(square[1].charAt(1) + square[1].charAt(0) + "/" + square[0].charAt(1) + square[0].charAt(0))
    rotations.push(square[0].charAt(1) + square[1].charAt(1) + "/" + square[0].charAt(0) + square[1].charAt(0))
    rotations.push(square[0].charAt(0) + square[1].charAt(0) + "/" + square[0].charAt(1) + square[1].charAt(1))
    rotations.push(square[1].charAt(0) + square[1].charAt(1) + "/" + square[0].charAt(0) + square[0].charAt(1))
    rotations.push(square[1].charAt(1) + square[0].charAt(1) + "/" + square[1].charAt(0) + square[0].charAt(0))
  } else {
    rotations.push(square[2].charAt(0) + square[1].charAt(0) + square[0].charAt(0) + "/" + square[2].charAt(1) + square[1].charAt(1) + square[0].charAt(1) + "/" + square[2].charAt(2) + square[1].charAt(2) + square[0].charAt(2))
    rotations.push(square[2].charAt(2) + square[2].charAt(1) + square[2].charAt(0) + "/" + square[1].charAt(2) + square[1].charAt(1) + square[1].charAt(0) + "/" + square[0].charAt(2) + square[0].charAt(1) + square[0].charAt(0))
    rotations.push(square[0].charAt(2) + square[1].charAt(2) + square[2].charAt(2) + "/" + square[0].charAt(1) + square[1].charAt(1) + square[2].charAt(1) + "/" + square[0].charAt(0) + square[1].charAt(0) + square[2].charAt(0))
    rotations.push(square[0].charAt(2) + square[0].charAt(1) + square[0].charAt(2) + "/" + square[1].charAt(2) + square[1].charAt(1) + square[1].charAt(0) + "/" + square[2].charAt(2) + square[2].charAt(1) + square[2].charAt(0))
    rotations.push(square[0].charAt(0) + square[1].charAt(0) + square[2].charAt(0) + "/" + square[0].charAt(1) + square[1].charAt(1) + square[2].charAt(1) + "/" + square[0].charAt(2) + square[1].charAt(2) + square[2].charAt(2))
    rotations.push(square[2].charAt(0) + square[2].charAt(1) + square[2].charAt(2) + "/" + square[1].charAt(0) + square[1].charAt(1) + square[1].charAt(2) + "/" + square[0].charAt(0) + square[0].charAt(1) + square[0].charAt(2))
    rotations.push(square[2].charAt(2) + square[1].charAt(2) + square[0].charAt(2) + "/" + square[2].charAt(1) + square[1].charAt(1) + square[0].charAt(1) + "/" + square[2].charAt(0) + square[1].charAt(0) + square[0].charAt(0))
  }

  return rotations
}

const printSquare = (square: string[]) => {
  for (let line of square) {
    console.log(line)
  }
}

const goA = (input, iterations: number) => {
  const lines = splitToLines(input)
  const rules = lines.map(line => parseRule(line))

  let square = convertSquareStringToSquare(".#./..#/###")

  for (let i = 0; i < iterations; i++) {
    const smallSquares = splitSquareInSmallSquares(square)
    const expanded = smallSquares.map(smallSquare => {
      const rotations = getAllRotationsOfSquare(convertSquareStringToSquare(smallSquare))

      return rules.find(rule => rotations.includes(rule.from)).to
    })

    const squaresPerRow = Math.sqrt(smallSquares.length)

    let newSquare = ""

    for (let y = 0; y < squaresPerRow; y++) {
      for (let y2 = 0; y2 < expanded[0].split("/").length; y2++) {
        let newSquareLine = ""
        for (let x = 0; x < squaresPerRow; x++) {
          const expandedSmallSquare = expanded[y * squaresPerRow + x]
          newSquareLine += expandedSmallSquare.split("/")[y2]
        }
        newSquare += newSquareLine + "/"
      }
    }

    square = convertSquareStringToSquare(newSquare.substring(0, newSquare.length - 1))
  }

  let pixelsThatAreOn = 0;

  for(let y = 0; y < square.length; y++) {
    for(let x = 0; x < square[y].length; x++) {
      if(square[y].charAt(x) === "#") {
        pixelsThatAreOn++;
      }
    }
  }

  return pixelsThatAreOn
}

const goB = (input) => {
  return goA(input, 18)
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input, 5)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
