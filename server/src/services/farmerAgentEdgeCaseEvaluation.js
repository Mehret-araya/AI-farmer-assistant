import { decideAgentNeeds } from "./farmerAgentDecisionService.js";

const edgeCases = [
  {
    question: "What should I do about my tomatoes?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: true,
    },
  },

  {
    question: "Will the weather affect my tomato crop?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: true,
    },
  },

  {
    question: "What disease was detected on my crops and what should I do?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: true,
      needsWeather: false,
      needsKnowledge: true,
    },
  },

  {
    question: "Is rain expected and how should I protect my tomatoes?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: true,
    },
  },

  {
    question: "What is the weather?",
    language: "en",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: false,
    },
  },

  {
    question: "What are the symptoms of late blight?",
    language: "en",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: true,
    },
  },

  {
    question: "Show my previous disease analyses.",
    language: "en",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: true,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "What crops do I have and what is their weather?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: false,
    },
  },
];

export const evaluateFarmerAgentEdgeCases = () => {
  const results = edgeCases.map((testCase) => {
    let actual;

    try {
      actual = decideAgentNeeds(
        testCase.question,
        testCase.language
      );
    } catch (error) {
      return {
        ...testCase,
        passed: false,
        error: error.message,
      };
    }

    const passed =
      actual.needsCrops === testCase.expected.needsCrops &&
      actual.needsDiseaseAnalyses ===
        testCase.expected.needsDiseaseAnalyses &&
      actual.needsWeather === testCase.expected.needsWeather &&
      actual.needsKnowledge === testCase.expected.needsKnowledge;

    return {
      ...testCase,
      actual,
      passed,
    };
  });

  const total = results.length;
  const passed = results.filter((result) => result.passed).length;
  const failed = total - passed;

  return {
    total,
    passed,
    failed,
    accuracy: total > 0 ? passed / total : 0,
    results,
  };
};