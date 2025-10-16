// vitest.config.js
export default {
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.js'],
    hookTimeout: 30000,
  },
};
