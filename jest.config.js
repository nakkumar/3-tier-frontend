module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
};
