import "dotenv/config";
import { askAssistant } from "./assistantClient.js";

try {
  const result = await askAssistant(
    "What are three basic things a tomato farmer should check every morning?"
  );

  console.log("\nAI RESPONSE:\n");
  console.log(result);
} catch (error) {
  console.error("\nAI TEST FAILED:\n");
  console.error(error.message);
}