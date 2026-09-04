import dotenv from "dotenv";
import connectDB from "../config/database.js";
import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";

dotenv.config({ path: ".env" });

const knowledgeData = [
  // =========================================================
  // ENGLISH — 6 DOCUMENTS
  // =========================================================

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Early Blight",
    language: "en",
    title: "Tomato Early Blight",
    content:
      "Early blight is a fungal disease that commonly affects tomato plants. Symptoms often begin as small dark spots on older leaves. The spots can develop into larger brown lesions with concentric rings. Severely affected leaves may turn yellow and fall from the plant. Good field sanitation, removing infected leaves, avoiding unnecessary leaf wetness, and maintaining good spacing between plants can help reduce disease spread.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "early blight",
      "disease",
      "symptoms",
      "prevention",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Late Blight",
    language: "en",
    title: "Tomato Late Blight",
    content:
      "Late blight is a serious disease that can affect tomato plants under cool and humid conditions. Symptoms may include irregular dark lesions on leaves and dark areas on stems. Tomato fruits can also develop firm dark lesions. Removing severely infected plant material, improving air circulation, avoiding prolonged leaf wetness, and monitoring plants carefully can help reduce the spread of the disease.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "late blight",
      "disease",
      "symptoms",
      "prevention",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Healthy",
    language: "en",
    title: "Healthy Tomato Plants",
    content:
      "Healthy tomato plants generally have vigorous green leaves, strong stems, and normal growth. Regular monitoring is important because early detection of disease can reduce crop losses. Farmers should inspect leaves, stems, and fruits regularly and maintain appropriate spacing, irrigation, nutrition, and field sanitation.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "healthy",
      "plant health",
      "monitoring",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Uncertain",
    language: "en",
    title: "Uncertain Tomato Disease Assessment",
    content:
      "When a disease assessment is uncertain, the farmer should not assume that a specific disease is present. The plant should be inspected carefully for symptoms on leaves, stems, and fruits. Taking a clear photograph in good lighting and consulting reliable agricultural guidance can improve assessment. Avoid applying a treatment solely on the basis of an uncertain diagnosis.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "uncertain",
      "diagnosis",
      "plant health",
    ],
  },

  {
    crop: "Tomato",
    topic: "irrigation",
    disease: null,
    language: "en",
    title: "Tomato Irrigation",
    content:
      "Tomato plants need consistent access to water, especially during flowering and fruit development. Irrigation should provide adequate moisture without keeping the soil continuously waterlogged. Watering near the base of the plant and avoiding unnecessary wetting of foliage can help reduce conditions that favor some diseases.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "irrigation",
      "watering",
      "water management",
    ],
  },

  {
    crop: "Tomato",
    topic: "general care",
    disease: null,
    language: "en",
    title: "General Tomato Crop Care",
    content:
      "Tomato crops should be monitored regularly for changes in leaf color, spots, wilting, pests, and fruit problems. Maintaining appropriate plant spacing, removing severely diseased plant material, controlling weeds, providing suitable nutrition, and managing irrigation are important parts of good crop management.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "crop care",
      "plant health",
      "monitoring",
    ],
  },

  // =========================================================
  // AMHARIC — 6 DOCUMENTS
  // =========================================================

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Early Blight",
    language: "am",
    title: "የቲማቲም ቀደምት ብላይት",
    content:
      "ቀደምት ብላይት በቲማቲም ተክሎች ላይ በብዛት የሚከሰት የፈንገስ በሽታ ነው። ምልክቶቹ ብዙውን ጊዜ በአሮጌ ቅጠሎች ላይ እንደ ትንንሽ ጥቁር ነጠብጣቦች ይጀምራሉ። ከዚያም ነጠብጣቦቹ ወደ ትልልቅ ቡናማ ቁስሎች ሊለወጡ ይችላሉ። የተበከሉ ቅጠሎችን ማስወገድ፣ ቅጠሎችን ሳያስፈልግ እርጥብ ከማድረግ መቆጠብ እና በተክሎች መካከል በቂ ርቀት መጠበቅ የበሽታውን መስፋፋት ሊቀንስ ይችላል።",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "ቲማቲም",
      "ቀደምት ብላይት",
      "በሽታ",
      "ምልክቶች",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Late Blight",
    language: "am",
    title: "የቲማቲም ዘግይቶ የሚከሰት ብላይት",
    content:
      "ዘግይቶ የሚከሰት ብላይት በቀዝቃዛና እርጥበት ባለበት ሁኔታ የቲማቲም ተክሎችን ሊያጠቃ የሚችል ከባድ በሽታ ነው። በቅጠሎች ላይ ጥቁር ቁስሎች እና በፍሬዎች ላይ ጥቁር ቦታዎች ሊታዩ ይችላሉ። የተበከሉ የተክል ክፍሎችን ማስወገድና ጥሩ የአየር ዝውውር ማስጠበቅ የበሽታውን መስፋፋት ሊቀንስ ይችላል።",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "ቲማቲም",
      "ዘግይቶ ብላይት",
      "በሽታ",
      "ምልክቶች",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Healthy",
    language: "am",
    title: "ጤናማ የቲማቲም ተክሎች",
    content:
      "ጤናማ የቲማቲም ተክሎች በአጠቃላይ ጠንካራ አረንጓዴ ቅጠሎች፣ ጠንካራ ግንዶች እና መደበኛ እድገት ያሳያሉ። ተክሎችን በየጊዜው መመርመር የበሽታ ምልክቶችን በቶሎ ለመለየት ይረዳል።",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "ቲማቲም",
      "ጤናማ",
      "የተክል ጤና",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Uncertain",
    language: "am",
    title: "ያልተረጋገጠ የቲማቲም በሽታ ግምገማ",
    content:
      "የበሽታ ግምገማ እርግጠኛ ካልሆነ አንድ የተወሰነ በሽታ አለ ብሎ መደምደም የለበትም። ቅጠሎች፣ ግንዶች እና ፍሬዎች በጥንቃቄ መመርመር አለባቸው። ግልጽ ፎቶ ማንሳትና ታማኝ የግብርና መመሪያን መጠቀም ግምገማውን ሊያሻሽል ይችላል።",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "ቲማቲም",
      "ያልተረጋገጠ",
      "ምርመራ",
      "የተክል ጤና",
    ],
  },

  {
    crop: "Tomato",
    topic: "irrigation",
    disease: null,
    language: "am",
    title: "የቲማቲም መስኖ",
    content:
      "የቲማቲም ተክሎች በተለይ በአበባና በፍሬ እድገት ወቅት በቂና ቋሚ ውሃ ያስፈልጋቸዋል። ውሃ በቂ እርጥበት እንዲኖር መስጠት አለበት፣ ነገር ግን አፈሩን ሁልጊዜ በውሃ መሞላት የለበትም። በተክሉ ሥር አካባቢ ማጠጣት ይመከራል።",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "ቲማቲም",
      "መስኖ",
      "ውሃ",
      "የውሃ አስተዳደር",
    ],
  },

  {
    crop: "Tomato",
    topic: "general care",
    disease: null,
    language: "am",
    title: "አጠቃላይ የቲማቲም እንክብካቤ",
    content:
      "የቲማቲም ሰብል የቅጠል ቀለም፣ ነጠብጣብ፣ መድረቅ፣ ተባዮች እና የፍሬ ችግሮችን ለመለየት በየጊዜው መመርመር አለበት። ተገቢ የተክል ርቀት፣ የአፈር እንክብካቤ፣ ተገቢ ምግብ እና ትክክለኛ መስኖ ጤናማ ሰብልን ለማምረት ይረዳሉ።",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "ቲማቲም",
      "የሰብል እንክብካቤ",
      "የተክል ጤና",
    ],
  },

  // =========================================================
  // SWAHILI — 6 DOCUMENTS
  // =========================================================

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Early Blight",
    language: "sw",
    title: "Baka ya Mapema ya Nyanya",
    content:
      "Baka ya mapema ni ugonjwa wa kawaida wa nyanya unaosababishwa na fangasi. Dalili zinaweza kuanza kama madoa madogo meusi kwenye majani ya zamani. Madoa yanaweza kuwa makubwa na kuwa vidonda vya kahawia vyenye miduara. Kuondoa majani yaliyoathirika, kuboresha nafasi kati ya mimea, na kuepuka kulowesha majani bila sababu kunaweza kusaidia kupunguza kuenea kwa ugonjwa.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "nyanya",
      "baka ya mapema",
      "ugonjwa",
      "dalili",
      "kinga",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Late Blight",
    language: "sw",
    title: "Baka ya Marehemu ya Nyanya",
    content:
      "Baka ya marehemu ni ugonjwa hatari unaoweza kuathiri nyanya katika hali ya baridi na unyevunyevu. Dalili zinaweza kujumuisha madoa makubwa meusi kwenye majani na maeneo meusi kwenye mashina. Matunda yanaweza pia kupata madoa magumu meusi. Kuondoa sehemu za mimea zilizoathirika, kuboresha mzunguko wa hewa, na kuepuka unyevunyevu wa muda mrefu kwenye majani kunaweza kusaidia kupunguza kuenea kwa ugonjwa.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "nyanya",
      "baka ya marehemu",
      "ugonjwa",
      "dalili",
      "kinga",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Healthy",
    language: "sw",
    title: "Mimea ya Nyanya yenye Afya",
    content:
      "Mimea ya nyanya yenye afya kwa kawaida huwa na majani ya kijani yenye nguvu, mashina imara, na ukuaji wa kawaida. Kufuatilia mimea mara kwa mara ni muhimu kwa sababu kugundua dalili za ugonjwa mapema kunaweza kupunguza hasara ya mazao. Wakulima wanapaswa kuchunguza majani, mashina, na matunda mara kwa mara.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "nyanya",
      "afya",
      "afya ya mmea",
      "ufuatiliaji",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Uncertain",
    language: "sw",
    title: "Tathmini Isiyo na Uhakika ya Ugonjwa wa Nyanya",
    content:
      "Ikiwa tathmini ya ugonjwa haina uhakika, mkulima hapaswi kudhani kuwa ugonjwa fulani umethibitishwa. Mmea unapaswa kuchunguzwa kwa makini kwa dalili kwenye majani, mashina, na matunda. Kupiga picha iliyo wazi katika mwanga mzuri na kutumia mwongozo wa kuaminika wa kilimo kunaweza kusaidia kuboresha tathmini.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "nyanya",
      "isiyo na uhakika",
      "utambuzi",
      "afya ya mmea",
    ],
  },

  {
    crop: "Tomato",
    topic: "irrigation",
    disease: null,
    language: "sw",
    title: "Umwagiliaji wa Nyanya",
    content:
      "Mimea ya nyanya inahitaji maji ya kutosha na ya kawaida, hasa wakati wa maua na ukuaji wa matunda. Umwagiliaji unapaswa kutoa unyevu wa kutosha bila kufanya udongo uwe na maji mengi muda wote. Kumwagilia karibu na sehemu ya chini ya mmea na kuepuka kulowesha majani kunaweza kusaidia kupunguza hali zinazoweza kuchochea baadhi ya magonjwa.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "nyanya",
      "umwagiliaji",
      "maji",
      "usimamizi wa maji",
    ],
  },

  {
    crop: "Tomato",
    topic: "general care",
    disease: null,
    language: "sw",
    title: "Utunzaji wa Jumla wa Zao la Nyanya",
    content:
      "Mazao ya nyanya yanapaswa kufuatiliwa mara kwa mara kwa mabadiliko ya rangi ya majani, madoa, kunyauka, wadudu, na matatizo ya matunda. Kudumisha nafasi inayofaa kati ya mimea, kuondoa sehemu za mimea zilizoathirika sana, kudhibiti magugu, kutoa virutubisho vinavyofaa, na kusimamia umwagiliaji ni sehemu muhimu za usimamizi mzuri wa zao.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "nyanya",
      "utunzaji wa zao",
      "afya ya mmea",
      "ufuatiliaji",
    ],
  },

  {
  crop: "Tomato",
  topic: "disease",
  disease: "Early Blight",
  language: "hi",
  title: "टमाटर का अर्ली ब्लाइट",
  content:
    "अर्ली ब्लाइट टमाटर का एक सामान्य रोग है जो फफूंद के कारण होता है। इसके लक्षण अक्सर पुरानी पत्तियों पर छोटे गहरे धब्बों के रूप में दिखाई देते हैं। बाद में ये धब्बे बड़े होकर भूरे रंग के गोलाकार घाव बन सकते हैं। संक्रमित पत्तियों को हटाना, पौधों के बीच उचित दूरी रखना और अनावश्यक रूप से पत्तियों को गीला करने से बचना रोग के फैलाव को कम करने में मदद कर सकता है।",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
  "tamatar",
  "early blight",
  "rog",
  "lakshan",
  "roktham",
],
},

{
  crop: "Tomato",
  topic: "disease",
  disease: "Late Blight",
  language: "hi",
  title: "टमाटर का लेट ब्लाइट",
  content:
    "लेट ब्लाइट एक गंभीर रोग है जो ठंडे और नम वातावरण में टमाटर को प्रभावित कर सकता है। इसके लक्षणों में पत्तियों पर बड़े गहरे धब्बे और तनों पर काले क्षेत्र शामिल हो सकते हैं। फलों पर भी कठोर काले धब्बे दिखाई दे सकते हैं। संक्रमित पौधों के हिस्सों को हटाना, हवा का अच्छा प्रवाह बनाए रखना और लंबे समय तक पत्तियों पर नमी रहने से बचना रोग के फैलाव को कम करने में मदद कर सकता है।",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
  "tamatar",
  "late blight",
  "rog",
  "lakshan",
  "roktham",
],

},

{
  crop: "Tomato",
  topic: "disease",
  disease: "Healthy",
  language: "hi",
  title: "स्वस्थ टमाटर के पौधे",
  content:
    "स्वस्थ टमाटर के पौधों में आमतौर पर मजबूत हरी पत्तियां, मजबूत तने और सामान्य वृद्धि दिखाई देती है। पौधों की नियमित निगरानी महत्वपूर्ण है क्योंकि रोग के शुरुआती लक्षणों का पता लगाने से फसल के नुकसान को कम करने में मदद मिल सकती है। किसानों को पत्तियों, तनों और फलों की नियमित जांच करनी चाहिए।",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
tags: [
  "tamatar",
  "swasthya",
  "paudhe ka swasthya",
  "nigrani",
],

},

{
  crop: "Tomato",
  topic: "disease",
  disease: "Uncertain",
  language: "hi",
  title: "टमाटर के रोग का अनिश्चित आकलन",
  content:
    "यदि रोग का आकलन अनिश्चित है, तो किसान को यह नहीं मानना चाहिए कि किसी विशेष रोग की पुष्टि हो गई है। पौधे की पत्तियों, तनों और फलों पर दिखाई देने वाले लक्षणों की सावधानीपूर्वक जांच करनी चाहिए। अच्छी रोशनी में स्पष्ट तस्वीर लेना और विश्वसनीय कृषि मार्गदर्शन का उपयोग करना आकलन को बेहतर बनाने में मदद कर सकता है।",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
  "tamatar",
  "anishchit",
  "nidan",
  "paudhe ka swasthya",
],

},

{
  crop: "Tomato",
  topic: "irrigation",
  disease: null,
  language: "hi",
  title: "टमाटर की सिंचाई",
  content:
    "टमाटर के पौधों को पर्याप्त और नियमित पानी की आवश्यकता होती है, विशेष रूप से फूल आने और फल बनने के समय। सिंचाई से मिट्टी में पर्याप्त नमी बनी रहनी चाहिए, लेकिन मिट्टी को लगातार बहुत अधिक गीला नहीं रखना चाहिए। पौधे के आधार के पास पानी देना और पत्तियों को गीला करने से बचना कुछ रोगों के लिए अनुकूल परिस्थितियों को कम करने में मदद कर सकता है।",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
  "tamatar",
  "sinchai",
  "pani",
  "jal prabandhan",
],
},

{
  crop: "Tomato",
  topic: "general care",
  disease: null,
  language: "hi",
  title: "टमाटर की सामान्य फसल देखभाल",
  content:
    "टमाटर की फसल में पत्तियों के रंग में बदलाव, धब्बे, मुरझाना, कीट और फलों की समस्याओं के लिए नियमित निगरानी करनी चाहिए। पौधों के बीच उचित दूरी बनाए रखना, गंभीर रूप से संक्रमित हिस्सों को हटाना, खरपतवार नियंत्रित करना, उचित पोषक तत्व देना और सिंचाई का सही प्रबंधन करना अच्छी फसल देखभाल के महत्वपूर्ण हिस्से हैं।",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",

  tags: [
  "tamatar",
  "fasal dekhbhal",
  "paudhe ka swasthya",
  "nigrani",
],
  
},

{
  crop: "Tomato",
  topic: "disease",
  disease: "Early Blight",
  language: "es",
  title: "Tizón temprano del tomate",
  content:
    "El tizón temprano es una enfermedad común del tomate causada por hongos. Los síntomas pueden comenzar como pequeñas manchas oscuras en las hojas más viejas. Las manchas pueden aumentar de tamaño y formar lesiones marrones con anillos. Retirar las hojas afectadas, mantener una distancia adecuada entre las plantas y evitar mojar las hojas innecesariamente puede ayudar a reducir la propagación de la enfermedad.",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
    "tomate",
    "tizón temprano",
    "enfermedad",
    "síntomas",
    "prevención",
  ],
},

{
  crop: "Tomato",
  topic: "disease",
  disease: "Late Blight",
  language: "es",
  title: "Tizón tardío del tomate",
  content:
    "El tizón tardío es una enfermedad grave que puede afectar al tomate en condiciones frías y húmedas. Los síntomas pueden incluir grandes manchas oscuras en las hojas y áreas negras en los tallos. Los frutos también pueden desarrollar manchas negras y firmes. Retirar las partes afectadas de las plantas, mejorar la circulación del aire y evitar la humedad prolongada en las hojas puede ayudar a reducir la propagación de la enfermedad.",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
    "tomate",
    "tizón tardío",
    "enfermedad",
    "síntomas",
    "prevención",
  ],
},

{
  crop: "Tomato",
  topic: "disease",
  disease: "Healthy",
  language: "es",
  title: "Plantas de tomate saludables",
  content:
    "Las plantas de tomate saludables normalmente tienen hojas verdes fuertes, tallos firmes y un crecimiento normal. Vigilar las plantas regularmente es importante porque detectar los primeros signos de enfermedad puede ayudar a reducir las pérdidas de la cosecha. Los agricultores deben revisar las hojas, los tallos y los frutos con frecuencia.",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
    "tomate",
    "salud",
    "salud de la planta",
    "monitoreo",
  ],
},

{
  crop: "Tomato",
  topic: "disease",
  disease: "Uncertain",
  language: "es",
  title: "Evaluación incierta de la enfermedad del tomate",
  content:
    "Si la evaluación de una enfermedad es incierta, el agricultor no debe asumir que una enfermedad específica ha sido confirmada. La planta debe examinarse cuidadosamente para detectar síntomas en las hojas, los tallos y los frutos. Tomar una fotografía clara con buena iluminación y utilizar una guía agrícola confiable puede ayudar a mejorar la evaluación.",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
    "tomate",
    "incierto",
    "diagnóstico",
    "salud de la planta",
  ],
},

{
  crop: "Tomato",
  topic: "irrigation",
  disease: null,
  language: "es",
  title: "Riego del tomate",
  content:
    "Las plantas de tomate necesitan suficiente agua de forma regular, especialmente durante la floración y el desarrollo de los frutos. El riego debe proporcionar suficiente humedad sin mantener el suelo excesivamente húmedo durante todo el tiempo. Regar cerca de la base de la planta y evitar mojar las hojas puede ayudar a reducir las condiciones que favorecen algunas enfermedades.",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
    "tomate",
    "riego",
    "agua",
    "manejo del agua",
  ],
},

{
  crop: "Tomato",
  topic: "general care",
  disease: null,
  language: "es",
  title: "Cuidado general del cultivo de tomate",
  content:
    "Los cultivos de tomate deben vigilarse regularmente para detectar cambios en el color de las hojas, manchas, marchitez, plagas y problemas en los frutos. Mantener una distancia adecuada entre las plantas, retirar las partes muy afectadas, controlar las malas hierbas, proporcionar nutrientes adecuados y manejar correctamente el riego son partes importantes del buen manejo del cultivo.",
  source: "Agricultural Extension Knowledge Base",
  sourceUrl: "",
  tags: [
    "tomate",
    "cuidado del cultivo",
    "salud de la planta",
    "monitoreo",
  ],
},
];

const seedKnowledge = async () => {
  try {
    await connectDB();

    await AgriculturalKnowledge.deleteMany({});

    await AgriculturalKnowledge.insertMany(knowledgeData);

    console.log(
      `Successfully inserted ${knowledgeData.length} knowledge documents.`
    );

    process.exit(0);
  } catch (error) {
    console.error("Knowledge seed failed:", error.message);
    process.exit(1);
  }
};

seedKnowledge();
