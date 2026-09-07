import { evaluateFarmerAgentEdgeCases } from "./farmerAgentEdgeCaseEvaluation.js";

const evaluation = evaluateFarmerAgentEdgeCases();

console.log("\n🌱 Farmer Agent Edge-Case Evaluation");
console.log("------------------------------------");
console.log(`Total: ${evaluation.total}`);
console.log(`Passed: ${evaluation.passed}`);
console.log(`Failed: ${evaluation.failed}`);
console.log(
  `Accuracy: ${(evaluation.accuracy * 100).toFixed(2)}%`
);

console.log("\nDetailed Results:");

evaluation.results.forEach((result, index) => {
  console.log(
    `\n${index + 1}. ${
      result.passed ? "PASS" : "FAIL"
    }`
  );

  console.log(`Question: ${result.question}`);
  console.log(`Language: ${result.language}`);

  console.log("Expected:", result.expected);
  console.log("Actual:", result.actual);

  if (result.error) {
    console.log(`Error: ${result.error}`);
  }
});

if (evaluation.failed > 0) {
  console.log("\n⚠️ Some edge cases failed.");
  process.exitCode = 1;
} else {
  console.log("\n✅ All edge cases passed.");
}