import {
  validateFarmerAgentToolResult,
} from "./farmerAgentResultValidationService.js";

const tests = [
  {
    tool: "crops",
    result: [],
    expected: true,
  },
  {
    tool: "diseaseAnalyses",
    result: [],
    expected: true,
  },
  {
    tool: "knowledge",
    result: [],
    expected: true,
  },
  {
    tool: "weather",
    result: null,
    expected: true,
  },
  {
    tool: "weather",
    result: {},
    expected: true,
  },
  {
    tool: "crops",
    result: {},
    expected: false,
  },
  {
    tool: "knowledge",
    result: "invalid",
    expected: false,
  },
  {
    tool: "unknown",
    result: [],
    expected: false,
  },
];

let passed = 0;

console.log("\n🌱 Farmer Agent Result Validation");
console.log("---------------------------------");

tests.forEach((test, index) => {
  const validation = validateFarmerAgentToolResult(
    test.tool,
    test.result
  );

  const success =
    validation.valid === test.expected;

  if (success) {
    passed++;
  }

  console.log(
    `${index + 1}. ${
      success ? "PASS" : "FAIL"
    }`
  );

  console.log(`Tool: ${test.tool}`);
  console.log(`Expected: ${test.expected}`);
  console.log(`Actual: ${validation.valid}`);
  console.log(`Message: ${validation.message}`);
});

console.log("\n-------------------------------");
console.log(`Total: ${tests.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${tests.length - passed}`);

if (passed === tests.length) {
  console.log("\n✅ All result validation tests passed.");
} else {
  console.log("\n⚠️ Some result validation tests failed.");
  process.exitCode = 1;
}