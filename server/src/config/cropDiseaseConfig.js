const cropDiseaseConfig = {
  tomato: {
    aiEnabled: true,

    diseases: [
      "Healthy",
      "Early Blight",
      "Late Blight",
      "Uncertain",
    ],
  },

  maize: {
    aiEnabled: false,

    diseases: [
      "Healthy",
      "Uncertain",
    ],
  },

  wheat: {
    aiEnabled: false,

    diseases: [
      "Healthy",
      "Uncertain",
    ],
  },

  coffee: {
    aiEnabled: false,

    diseases: [
      "Healthy",
      "Uncertain",
    ],
  },
};

export default cropDiseaseConfig;