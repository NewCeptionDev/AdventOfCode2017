import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Connector {
  side1: number,
  side2: number
}

const parseConnector = (line: string): Connector => {
  const split = line.split("/")

  return {
    side1: parseInt(split[0]),
    side2: parseInt(split[1])
  }
}


const getAllPossibleBridges = (requiredConnector: number, possibleConnectors: Connector[]): Connector[][] => {
  const possibleDirectConnectors = possibleConnectors.filter(possible => possible.side1 === requiredConnector || possible.side2 === requiredConnector)

  let results = [[]];

  for(let connector of possibleDirectConnectors) {
    let otherSide = connector.side1 === requiredConnector ? connector.side2 : connector.side1
    const following = getAllPossibleBridges(otherSide, [...possibleConnectors].filter(con => con.side1 !== connector.side1 || con.side2 !== connector.side2))

    for(let follow of following) {
      results.push([connector, ...follow])
    }
  }

  return results;
}

const goA = (input) => {
  const lines = splitToLines(input)
  const connectors = lines.map(line => parseConnector(line))

  const allPossibleBridges = getAllPossibleBridges(0, connectors)

  return allPossibleBridges.map(bridge => bridge.map(connector => connector.side1 + connector.side2).reduce((previousValue, currentValue) => previousValue + currentValue, 0)).sort((a, b) => a - b).pop()
}

const goB = (input) => {
  const lines = splitToLines(input)
  const connectors = lines.map(line => parseConnector(line))

  const allPossibleBridges = getAllPossibleBridges(0, connectors)

  const maxLength = allPossibleBridges.map(bridge => bridge.length).sort((a, b) => a - b).pop();

  return allPossibleBridges.filter(bridge => bridge.length === maxLength).map(bridge => bridge.map(connector => connector.side1 + connector.side2).reduce((previousValue, currentValue) => previousValue + currentValue, 0)).sort((a, b) => a - b).pop()
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
