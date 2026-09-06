import { decideAgentNeeds } from "./farmerAgentDecisionService.js";

const evaluationCases = [
  {
    question: "What crops do I have?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "What is the weather for my farm?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: false,
    },
  },

  {
    question: "What are the symptoms of early blight?",
    language: "en",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: true,
    },
  },

  {
    question: "What diseases were recently detected?",
    language: "en",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: true,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question:
      "What should I do about my tomato crop based on the weather?",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: true,
    },
  },

  {
    question: "What is the best way to irrigate tomatoes?",
    language: "en",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: true,
    },
  },

  {
    question: "Show me my farm information.",
    language: "en",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "Tell me about my previous disease analyses.",
    language: "en",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: true,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "የእኔ ሰብሎች ምን ምን ናቸው?",
    language: "am",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "ለእርሻዬ የአየር ሁኔታ ምን ይመስላል?",
    language: "am",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: false,
    },
  },

  {
    question: "የቀደሙትን የበሽታ ትንተናዎች ንገረኝ።",
    language: "am",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: true,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "Je, nina mazao gani?",
    language: "sw",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "Hali ya hewa kwenye shamba langu ikoje?",
    language: "sw",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: false,
    },
  },

  {
    question: "Dalili za ukungu wa mapema ni zipi?",
    language: "sw",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: true,
    },
  },

  {
    question: "मेरे पास कौन सी फसलें हैं?",
    language: "hi",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

  {
    question: "मेरे खेत के लिए मौसम कैसा है?",
    language: "hi",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: true,
      needsKnowledge: false,
    },
  },

  {
    question: "टमाटर में अर्ली ब्लाइट के लक्षण क्या हैं?",
    language: "hi",
    expected: {
      needsCrops: false,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: true,
    },
  },

  {
    question: "¿Qué cultivos tengo?",
    language: "es",
    expected: {
      needsCrops: true,
      needsDiseaseAnalyses: false,
      needsWeather: false,
      needsKnowledge: false,
    },
  },

];

const matchesExpectedDecision = (actual, expected) => {
  return (
    actual.needsCrops === expected.needsCrops &&
    actual.needsDiseaseAnalyses ===
      expected.needsDiseaseAnalyses &&
    actual.needsWeather === expected.needsWeather &&
    actual.needsKnowledge === expected.needsKnowledge
  );
};

export const evaluateFarmerAgent = () => {
  const results = evaluationCases.map((testCase) => {
    const actual = decideAgentNeeds(
      testCase.question,
      testCase.language
    );

    const passed = matchesExpectedDecision(
      actual,
      testCase.expected
    );

    return {
      question: testCase.question,
      language: testCase.language,
      passed,
      expected: testCase.expected,
      actual: {
        needsCrops: actual.needsCrops,
        needsDiseaseAnalyses:
          actual.needsDiseaseAnalyses,
        needsWeather: actual.needsWeather,
        needsKnowledge: actual.needsKnowledge,
        responseType: actual.responseType,
      },
    };
  });

  const passed = results.filter(
    (result) => result.passed
  ).length;

  const failed = results.length - passed;

  return {
    total: results.length,
    passed,
    failed,
    accuracy:
      results.length > 0
        ? passed / results.length
        : 0,
    results,
  };
};