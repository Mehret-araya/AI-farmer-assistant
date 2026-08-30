const cropDiseaseConfig = {
  tomato: {
    aiEnabled: true,

    diseases: {
      Healthy: {
        explanation:
          "The tomato plant appears healthy with no clear signs of the supported diseases.",
        recommendation:
          "Continue regular watering, nutrition, field monitoring, and pest management.",
        severity: "none",
      },

      "Early Blight": {
        explanation:
          "Early blight is a fungal disease that commonly causes dark spots and yellowing on tomato leaves.",
        recommendation:
          "Remove severely affected leaves, avoid overhead watering, improve air circulation, and monitor nearby plants.",
        severity: "moderate",
      },

      "Late Blight": {
        explanation:
          "Late blight is a serious disease that can cause dark lesions on leaves, stems, and fruit.",
        recommendation:
          "Remove affected plant material, reduce leaf wetness, improve air circulation, and seek appropriate agricultural treatment advice.",
        severity: "high",
      },

      Uncertain: {
        explanation:
          "The image could not be classified confidently as one of the supported tomato conditions.",
        recommendation:
          "Take a clearer photo showing the affected leaves or fruit and monitor the plant for changes.",
        severity: "unknown",
      },
    },
  },

  maize: {
    aiEnabled: false,

    diseases: {
      Healthy: {
        explanation:
          "No supported maize disease has been identified.",
        recommendation:
          "Continue regular crop monitoring and good field management.",
        severity: "none",
      },

      Uncertain: {
        explanation:
          "AI disease detection is not currently available for maize.",
        recommendation:
          "Continue monitoring the crop and provide a clear image when AI support becomes available.",
        severity: "unknown",
      },
    },
  },

  wheat: {
    aiEnabled: false,

    diseases: {
      Healthy: {
        explanation:
          "No supported wheat disease has been identified.",
        recommendation:
          "Continue regular crop monitoring and good field management.",
        severity: "none",
      },

      Uncertain: {
        explanation:
          "AI disease detection is not currently available for wheat.",
        recommendation:
          "Continue monitoring the crop and provide a clear image when AI support becomes available.",
        severity: "unknown",
      },
    },
  },

  coffee: {
    aiEnabled: false,

    diseases: {
      Healthy: {
        explanation:
          "No supported coffee disease has been identified.",
        recommendation:
          "Continue regular crop monitoring and good field management.",
        severity: "none",
      },

      Uncertain: {
        explanation:
          "AI disease detection is not currently available for coffee.",
        recommendation:
          "Continue monitoring the crop and provide a clear image when AI support becomes available.",
        severity: "unknown",
      },
    },
  },
};

export default cropDiseaseConfig;