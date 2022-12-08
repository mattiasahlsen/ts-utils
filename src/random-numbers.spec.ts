import { RandomNumberGenerator } from './random-numbers'

describe('RandomNumberGenerator', () => {
  it('generates random numbers', () => {
    const random = new RandomNumberGenerator(1)
    const randomNumber = random.randomNumber()
    expect(randomNumber).toBeGreaterThan(0)
    expect(randomNumber).toBeLessThan(1)
  })

  it('generates random numbers between 0 and a max', () => {
    const random = new RandomNumberGenerator(1)
    const randomNumber = random.randomNumber(10)
    expect(randomNumber).toBeGreaterThan(0)
    expect(randomNumber).toBeLessThan(10)
  })

  it('generates random integers', () => {
    const random = new RandomNumberGenerator(1)
    const randomNumber = random.randomInt(10)
    expect(randomNumber).toBeGreaterThan(0)
    expect(randomNumber).toBeLessThan(10)
    expect(Number.isInteger(randomNumber)).toBe(true)
  })

  it("generates the same sequence of random numbers when the seed doesn't change", () => {
    const random = new RandomNumberGenerator(1)
    const randomNumber1 = random.randomNumber()
    const randomNumber2 = random.randomNumber()
    const randomNumber3 = random.randomNumber()

    const random2 = new RandomNumberGenerator(1)
    const randomNumber4 = random2.randomNumber()
    const randomNumber5 = random2.randomNumber()
    const randomNumber6 = random2.randomNumber()

    expect(randomNumber1).toEqual(randomNumber4)
    expect(randomNumber2).toEqual(randomNumber5)
    expect(randomNumber3).toEqual(randomNumber6)
  })

  it('generates a different sequence of random numbers when the seed changes', () => {
    const random = new RandomNumberGenerator(1)
    const randomNumber1 = random.randomNumber()
    const randomNumber2 = random.randomNumber()
    const randomNumber3 = random.randomNumber()

    random.resetSeed(2)
    const randomNumber4 = random.randomNumber()
    const randomNumber5 = random.randomNumber()
    const randomNumber6 = random.randomNumber()

    expect(randomNumber1).not.toEqual(randomNumber4)
    expect(randomNumber2).not.toEqual(randomNumber5)
    expect(randomNumber3).not.toEqual(randomNumber6)
  })

  it('generates a random number between 10 and 50', () => {
    const random = new RandomNumberGenerator(1)
    const randomNumber = random.randomNumber(40) + 10
    expect(randomNumber).toBeGreaterThan(10)
    expect(randomNumber).toBeLessThan(50)
  })
})
