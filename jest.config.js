module.exports = {
  // preset: 'jest-expo', // Commented out
  testEnvironment: 'node',
  transform: {
    // Ensure .js and .jsx files are transformed using babel-jest
    // This will use babel.config.js, which has babel-preset-expo
    // For a pure Node test, a simpler Babel config might be better, but let's see.
    '^.+\\.[tj]sx?$': 'babel-jest', 
  },
  // Default ignore pattern. If expr-eval or other deps need transpiling,
  // they should be excluded from this pattern (i.e., negated).
  // Example: 'node_modules/(?!(module-to-transpile|another-module)/)'
  // For now, let's assume expr-eval is CJS or babel-preset-expo handles it.
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$',
  ],
  // setupFilesAfterEnv: ['./jest.setup.js'], // Commented out
};
