import { decideAgentNeeds } from "../services/farmerAgentDecisionService.js";

const questions = [
  "What are the symptoms of early blight in tomato?",
  "What is the weather for my farm?",
  "What diseases were recently detected?",
  "How should I care for my tomato crop?",
];

for (const question of questions) {
  console.log("\nQuestion:", question);

  const decision = decideAgentNeeds(question);

  console.log("Decision:", decision);
}

console.log("\nFarmer agent decision test completed successfully.");