import { readInput, test } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

interface Vector {
  x: number;
  y: number;
  z: number;
}

interface Particle {
  id: number,
  position: Vector;
  acceleration: Vector;
  velocity: Vector;
}

const parseVector = (vectorString: string): Vector => {
  const vectorCoordinates = vectorString.substring(vectorString.indexOf("<") + 1, vectorString.indexOf(">")).split(",");

  return {
    x: parseInt(vectorCoordinates[0]),
    y: parseInt(vectorCoordinates[1]),
    z: parseInt(vectorCoordinates[2])
  }
}

const parseParticle = (particleString: string, index: number): Particle => {
  const parts = particleString.split(", ");

  return {
    id: index,
    position: parseVector(parts[0]),
    velocity: parseVector(parts[1]),
    acceleration: parseVector(parts[2])
  }
}

const calculateManhattanDistanceForVector = (vector: Vector): number => {
  return Math.abs(vector.x) + Math.abs(vector.y) + Math.abs(vector.z);
}

const calculateParticlePosition = (particle: Particle, tick: number): Vector => {
  return {
    x: particle.position.x + particle.velocity.x + (particle.acceleration.x * tick),
    y: particle.position.y + particle.velocity.y + (particle.acceleration.y * tick),
    z: particle.position.z + particle.velocity.z + (particle.acceleration.z * tick)
  }
}

const vectorEqual = (vec1: Vector, vec2: Vector): boolean => {
  return vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z;
}

const input = prepareInput(readInput())

const goA = (input) => {
  const lines = splitToLines(input);
  const particles = lines.map((line, index) => parseParticle(line, index));

  let smallestAccelerationParticle;

  for(let particle of particles) {
    if(smallestAccelerationParticle) {
      const smallestAcceleration = calculateManhattanDistanceForVector(smallestAccelerationParticle.acceleration);
      const currentAcceleration = calculateManhattanDistanceForVector(particle.acceleration);

      if(currentAcceleration < smallestAcceleration){
        smallestAccelerationParticle = particle;
      } else if(currentAcceleration === smallestAcceleration) {
        const smallestStartVelocity = calculateManhattanDistanceForVector(smallestAccelerationParticle.velocity);
        const currentStartVelocity = calculateManhattanDistanceForVector(particle.velocity)

        if(currentStartVelocity < smallestStartVelocity) {
          smallestAccelerationParticle = particle;
        }
      }

    } else {
      smallestAccelerationParticle = particle
    }
  }

  return smallestAccelerationParticle.id
}

const goB = (input) => {
  const lines = splitToLines(input);
  let renderedParticles = lines.map((line, index) => parseParticle(line, index));

  for(let i = 1; i < 1000; i++) {
    const particlePositions = renderedParticles.map(particle => {
      return {
        id: particle.id,
        position: calculateParticlePosition(particle, i)
      }
    })

    // console.log(particlePositions)

    const collidedParticles: number[] = [];

    for(let j = 0; j < particlePositions.length; j++) {
      for(let k = j + 1; k < particlePositions.length; k++) {
        if(vectorEqual(particlePositions[j].position, particlePositions[k].position)) {
          collidedParticles.push(particlePositions[j].id);
          collidedParticles.push(particlePositions[k].id);
        }
      }
    }

    renderedParticles = renderedParticles.filter(particle => !collidedParticles.includes(particle.id));

    renderedParticles.forEach(particle => particle.position = particlePositions.find(currentParticle => currentParticle.id === particle.id).position)
  }

  return renderedParticles.length
}

/* Tests */

test(parseParticle("p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>", 0), {
  id: 0,
  position: {
    x: 3,
    y: 0,
    z: 0
  },
  velocity: {
    x: 2,
    y: 0,
    z: 0
  },
  acceleration: {
    x: -1,
    y: 0,
    z: 0
  }
})

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
