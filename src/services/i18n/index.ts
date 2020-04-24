import { globalState } from '@/store';
import { Language } from "@/translations";
import Vue from "vue";
import VueI18n from "vue-i18n";
import config from "@/config";
import en from "@/translations/en";

Vue.use(VueI18n);

const i18n = new VueI18n({
  fallbackLocale: config.defaultLanguage,
  messages: { en }
});

const loadedLanguages: Language[] = [config.defaultLanguage];
setLanguage(globalState.currentLang);

export { i18n, setLanguage };

/**
 * Changes language of app dynamically fetching language file from translations folder
 *
 * @param {Language} lang language key (must be same as file name in translations folder)
 * @returns
 */
function setLanguage(lang: Language) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `@/translations/${lang}`).then(
        msgs => {
          i18n.setLocaleMessage(lang, msgs.default);
          loadedLanguages.push(lang);
          return setLanguageInternal(lang);
        }
      );
    }
    return Promise.resolve(setLanguageInternal(lang));
  }
  return Promise.resolve(lang);
}

/**
 * Changes document's language and i18n instance language
 *
 * @param {Language} lang
 * @returns
 */
function setLanguageInternal(lang: Language) {
  i18n.locale = lang;
  document.documentElement.setAttribute("lang", lang);
  globalState.updateLang(lang);
  return lang;
}
