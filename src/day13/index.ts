import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Layer {
  depth: number;
  range: number;
}

const parseLayer = (line: string): Layer => {
  const split = line.split(": ")

  return {
    depth: parseInt(split[0]),
    range: parseInt(split[1])
  }

}

const calculateSeverity = (layer: Layer): number => {
  return layer.depth * layer.range;
}

const scannerAtPositionZeroOnTime = (range: number, time: number): boolean => {
  return time % (range * 2 - 2) === 0;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const layers = lines.map(line => parseLayer(line));


  return layers.map(layer => {
    if(scannerAtPositionZeroOnTime(layer.range, layer.depth)) {
      return calculateSeverity(layer)
    } else {
      return 0;
    }
  }).reduce((previousValue, currentValue) => previousValue + currentValue);
}

const goB = (input) => {
  const lines = splitToLines(input);
  const layers = lines.map(line => parseLayer(line));

  let delay = 0;
  let severity = layers.map(layer => scannerAtPositionZeroOnTime(layer.range, layer.depth + delay) ? 1 : 0).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

  while(severity > 0) {
    delay++;
    severity = layers.map(layer => scannerAtPositionZeroOnTime(layer.range, layer.depth + delay) ? 1 : 0).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  return delay;
}

/* Tests */

test(scannerAtPositionZeroOnTime(3, 0), true)
test(scannerAtPositionZeroOnTime(3, 1), false)
test(scannerAtPositionZeroOnTime(3, 2), false)
test(scannerAtPositionZeroOnTime(3, 3), false)
test(scannerAtPositionZeroOnTime(3, 4), true)
test(scannerAtPositionZeroOnTime(3, 5), false)
test(scannerAtPositionZeroOnTime(3, 5), false)
test(scannerAtPositionZeroOnTime(3, 5), false)
test(scannerAtPositionZeroOnTime(3, 12), true)
test(goA(readTestFile()), 24)
test(goB(readTestFile()), 10)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
