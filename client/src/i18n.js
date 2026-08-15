import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import am from "./locales/am.json";
import sw from "./locales/sw.json";
import hi from "./locales/hi.json";
import es from "./locales/es.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      am: {
        translation: am,
      },
      sw: {
        translation: sw,
      },
      hi: {
        translation: hi,
      },
      es: {
        translation: es,
      },
    },

    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;