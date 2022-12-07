module.exports = {
  ...configDefaults(),
  coverageThreshold: coverageThreshold(50),
}

function coverageThreshold(threshold) {
  return {
    global: {
      branches: threshold,
      functions: threshold,
      lines: threshold,
      statements: threshold,
    },
  }
}

function configDefaults() {
  return {
    preset: 'ts-jest',
    testMatch: ['**/*.spec.ts'],
    coverageThreshold: coverageThreshold(50),
  }
}
