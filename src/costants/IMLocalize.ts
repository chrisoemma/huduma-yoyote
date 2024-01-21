import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './translations/en';
import sw from './translations/sw';

const LANGUAGES = {
  en,
  sw
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: (callback: any) => {
    AsyncStorage.getItem('user-language', (err, language) => {
      // if error fetching stored data or no language was stored
      // display errors when in DEV mode as console statements
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from AsyncStorage ', err);
        } else {
          console.log('No language is set, choosing English as fallback');
        }

        const findBestAvailableLanguage = RNLocalize.findBestLanguageTag(LANG_CODES);
        const fallbackLanguage = findBestAvailableLanguage ? findBestAvailableLanguage.languageTag : 'en';

        callback(err, fallbackLanguage);
      } else {
        callback(null, language);
      }
    });
  },

  init: () => {},
  cacheUserLanguage: (language: any) => {
    AsyncStorage.setItem('user-language', language);
  },
} as const;

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });

export default i18n;
