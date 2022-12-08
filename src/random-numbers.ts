export interface ISeedablePseudoRandomNumberGenerator {
  randomNumber(max?: number): number
  randomInt(max: number): number
  resetSeed(seed: number): void
}

/**
 * A simple seedable random number generator in typescript.
 */
export class RandomNumberGenerator
  implements ISeedablePseudoRandomNumberGenerator
{
  seed: number
  constructor(seed: number) {
    this.seed = seed
  }

  resetSeed(seed: number) {
    this.seed = seed
  }
  randomNumber(max = 1): number {
    const x = Math.sin(this.seed) * 10000
    this.seed += 1

    const randomNumberBetweenZeroAndOne = x - Math.floor(x)

    // console.log(randomNumberBetweenZeroAndOne, start, end);
    return max * randomNumberBetweenZeroAndOne
  }
  randomInt(max: number): number {
    return Math.floor(this.randomNumber(max))
  }
}
