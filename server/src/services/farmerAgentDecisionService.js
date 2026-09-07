const languageKeywords = {
  en: {
    weather: [
      "weather",
      "rain",
      "temperature",
      "forecast",
      "humidity",
      "wind",
    ],
diseaseHistory: [
  "recent disease",
  "recent diseases",
  "recent diagnosis",
  "recent diagnoses",
  "detected disease",
  "detected diseases",
  "disease analysis",
  "disease analyses",
  "my disease",
  "my diseases",
  "my diagnosis",
  "my diagnoses",
  "what diseases were recently detected",
  "diseases were recently detected",
  "recently detected diseases",
  "what disease was detected",
  "disease was detected",
  "what disease was found",
  "disease was found",
  "detected disease",
],
    

    crops: [
      "my crop",
      "my crops",
      "my tomato",
      "my tomatoes",
      "my farm",
      "my field",
      "what crops do i have",
      "which crops do i have",
      "what crop do i have",
      "which crop do i have",
    ],

    knowledge: [
      "symptom",
      "symptoms",
      "care",
      "prevent",
      "prevention",
      "irrigation",
      "water",
      "tomato",
      "early blight",
      "late blight",
      "how to treat",
      "treatment",
    ],
  },

  am: {
    weather: [
      "የአየር ሁኔታ",
      "ዝናብ",
      "ሙቀት",
      "ትንበያ",
      "እርጥበት",
      "ንፋስ",
    ],

    diseaseHistory: [
      "የቅርብ ጊዜ በሽታ",
      "በሽታ ተገኝቷል",
      "የበሽታ ምርመራ",
      "የበሽታ ትንተና",
      "በሽታዬ",
    ],

    crops: [
  "ሰብሎቼ",
  "ሰብሎች",
  "ሰብል",
  "ምን ምን ናቸው",
  "የእኔ ሰብሎች",
  "ቲማቲሞቼ",
  "ቲማቲም",
  "እርሻዬ",
  "መስኬ",
],

    knowledge: [
      "ምልክት",
      "ምልክቶች",
      "እንክብካቤ",
      "መከላከል",
      "መስኖ",
      "ውሃ",
      "ቲማቲም",
      "ቀደምት ብላይት",
      "ዘግይቶ የሚከሰት ብላይት",
      "ሕክምና",
      "ማከም",
    ],
  },

  sw: {
    weather: [
      "hali ya hewa",
      "mvua",
      "joto",
      "utabiri",
      "unyevu",
      "upepo",
    ],

    diseaseHistory: [
      "ugonjwa wa hivi karibuni",
      "magonjwa ya hivi karibuni",
      "utambuzi wa hivi karibuni",
      "ugonjwa uliogunduliwa",
      "uchambuzi wa ugonjwa",
    ],

    crops: [
  "mazao yangu",
  "mazao",
  "zao langu",
  "zao",
  "nina mazao gani",
  "nyanya zangu",
  "nyanya yangu",
  "shamba langu",
  "mashamba yangu",
],

    knowledge: [
      "dalili",
      "utunzaji",
      "kuzuia",
      "kinga",
      "umwagiliaji",
      "maji",
      "nyanya",
      "early blight",
      "late blight",
      "matibabu",
      "kutibu",
    ],
  },

  hi: {
    weather: [
      "मौसम",
      "बारिश",
      "तापमान",
      "पूर्वानुमान",
      "नमी",
      "हवा",
    ],

    diseaseHistory: [
      "हाल की बीमारी",
      "हाल की बीमारियाँ",
      "हाल का निदान",
      "पता चली बीमारी",
      "बीमारी का विश्लेषण",
    ],

    crops: [
  "मेरी फसल",
  "मेरी फसलें",
  "फसलें",
  "फसल",
  "कौन सी फसलें हैं",
  "मेरे पास कौन सी फसलें हैं",
  "मेरे टमाटर",
  "मेरा टमाटर",
  "मेरा खेत",
  "मेरे खेत",
],

    knowledge: [
      "लक्षण",
      "देखभाल",
      "रोकथाम",
      "सिंचाई",
      "पानी",
      "टमाटर",
      "अर्ली ब्लाइट",
      "लेट ब्लाइट",
      "इलाज",
      "उपचार",
    ],
  },

  es: {
    weather: [
      "clima",
      "lluvia",
      "temperatura",
      "pronóstico",
      "humedad",
      "viento",
    ],

    diseaseHistory: [
      "enfermedad reciente",
      "enfermedades recientes",
      "diagnóstico reciente",
      "enfermedad detectada",
      "análisis de enfermedad",
    ],

    crops: [
  "mi cultivo",
  "mis cultivos",
  "cultivos",
  "cultivo",
  "qué cultivos tengo",
  "mis tomates",
  "mi tomate",
  "mi granja",
  "mi campo",
],
    knowledge: [
      "síntoma",
      "síntomas",
      "cuidado",
      "prevenir",
      "prevención",
      "riego",
      "agua",
      "tomate",
      "tizón temprano",
      "tizón tardío",
      "tratamiento",
      "tratar",
    ],
  },
};

const containsAny = (text, keywords) => {
  return keywords.some((keyword) => text.includes(keyword));
};

export const decideAgentNeeds = (question, language = "en") => {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const text = question.toLowerCase().trim();

  const selectedLanguageKeywords =
    languageKeywords[language] || languageKeywords.en;

  const keywords = {
    weather: [
      ...selectedLanguageKeywords.weather,
      ...languageKeywords.en.weather,
    ],

    diseaseHistory: [
      ...selectedLanguageKeywords.diseaseHistory,
      ...languageKeywords.en.diseaseHistory,
    ],

    crops: [
      ...selectedLanguageKeywords.crops,
      ...languageKeywords.en.crops,
    ],

    knowledge: [
      ...selectedLanguageKeywords.knowledge,
      ...languageKeywords.en.knowledge,
    ],
  };

  // --------------------------------------------------
  // INITIAL INTENT DETECTION
  // --------------------------------------------------

  let needsWeather = containsAny(text, keywords.weather);

  const needsDiseaseAnalyses = containsAny(
    text,
    keywords.diseaseHistory
  );

  const needsCrops = containsAny(text, keywords.crops);

  let needsKnowledge = containsAny(
    text,
    keywords.knowledge
  );

  // --------------------------------------------------
  // KNOWLEDGE INTENT REFINEMENT
  // --------------------------------------------------
  //
  // Crop-specific questions such as:
  // "What crops do I have?"
  // should not automatically trigger agricultural
  // knowledge merely because a crop name appears.
  //
  // Strong knowledge terms such as symptoms,
  // treatment, prevention, irrigation, etc.
  // keep knowledge intent enabled.

  const strongKnowledgeKeywords = [
    ...selectedLanguageKeywords.knowledge.filter(
      (keyword) =>
        ![
          "tomato",
          "ቲማቲም",
          "nyanya",
          "टमाटर",
          "tomate",
        ].includes(keyword)
    ),
    ...languageKeywords.en.knowledge.filter(
      (keyword) =>
        ![
          "tomato",
          "tomatoes",
        ].includes(keyword)
    ),
  ];

  const strongKnowledgePhrases = [
  "what should i do",
  "what do i do",
  "how should i",
  "how do i",
  "what can i do",
  "what is the best way",
  "how can i",
  "what should we do",
  "will the weather affect",
  "weather affect my crop",
  "weather affect my crops",
  "weather affect my tomato",
  "weather affect my tomatoes",
];

  const hasStrongKnowledgeIntent =
  containsAny(text, strongKnowledgeKeywords) ||
  strongKnowledgePhrases.some((phrase) =>
    text.includes(phrase)
  );
  
const hasDiseaseActionIntent =
  needsDiseaseAnalyses &&
  (
    text.includes("what should i do") ||
    text.includes("what do i do") ||
    text.includes("how should i") ||
    text.includes("how do i") ||
    text.includes("what can i do") ||
    text.includes("what is the best way") ||
    text.includes("how can i") ||
    text.includes("what should we do")
  );

  if (hasStrongKnowledgeIntent || hasDiseaseActionIntent) {
  needsKnowledge = true;
}
  // If the question is only about the farmer's own
  // crops and does not contain a strong agricultural
  // knowledge request, do not retrieve RAG knowledge.
 
if (
  needsCrops &&
  !hasStrongKnowledgeIntent &&
  !hasDiseaseActionIntent
) {
  needsKnowledge = false;
}
  // --------------------------------------------------
  // RESPONSE TYPE
  // --------------------------------------------------

  let responseType = "general";

  const toolCount = [
    needsWeather,
    needsDiseaseAnalyses,
    needsKnowledge,
    needsCrops,
  ].filter(Boolean).length;

  if (toolCount > 1) {
    responseType = "multi_tool";
  } else if (needsWeather) {
    responseType = "weather";
  } else if (needsDiseaseAnalyses) {
    responseType = "disease_history";
  } else if (needsKnowledge) {
    responseType = "agricultural_knowledge";
  } else if (needsCrops) {
    responseType = "crop_information";
  }

  // --------------------------------------------------
  // AGENT REASONING
  // --------------------------------------------------

  const reasoning = [];

  if (needsWeather) {
    reasoning.push(
      "Weather-related information was detected in the farmer's question."
    );
  }

  if (needsDiseaseAnalyses) {
    reasoning.push(
      "The farmer's question refers to previous disease analysis or diagnosis information."
    );
  }

  if (needsKnowledge) {
    if (hasStrongKnowledgeIntent) {
      reasoning.push(
        "A strong agricultural knowledge request was detected."
      );
    } else {
      reasoning.push(
        "Agricultural knowledge was detected as relevant to the farmer's question."
      );
    }
  }

  if (needsCrops) {
    reasoning.push(
      "The farmer's registered crop or farm information was detected as relevant."
    );
  }

  if (needsCrops && !needsKnowledge) {
    reasoning.push(
      "Knowledge retrieval was not selected because the question appears to focus on the farmer's own crop information."
    );
  }

  if (reasoning.length === 0) {
    reasoning.push(
      "No specific agent tool was identified from the available decision keywords."
    );
  }

  return {
    needsKnowledge,
    needsCrops,
    needsDiseaseAnalyses,
    needsWeather,
    responseType,
    reasoning,
  };
};

