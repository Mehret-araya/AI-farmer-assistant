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
      "ሰብል",
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
      "zao langu",
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
  // WEATHER
  // --------------------------------------------------
  const needsWeather = containsAny(text, keywords.weather);

  // --------------------------------------------------
  // DISEASE ANALYSES
  // --------------------------------------------------
  const needsDiseaseAnalyses = containsAny(
    text,
    keywords.diseaseHistory
  );

  // --------------------------------------------------
  // FARMER CROPS
  // --------------------------------------------------
  const needsCrops = containsAny(text, keywords.crops);

  // --------------------------------------------------
  // AGRICULTURAL KNOWLEDGE
  // --------------------------------------------------
  const needsKnowledge = containsAny(
    text,
    keywords.knowledge
  );

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
  return {
    needsKnowledge,
    needsCrops,
    needsDiseaseAnalyses,
    needsWeather,
    responseType,
  };
};