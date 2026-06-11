import { es } from "@/locales/es.json";
import { en } from "@/locales/en.json";
import { fr } from "@/locales/fr.json";

export type LocaleCode = string;
export type suportedLng = LocaleCode;

export interface ScheduleToolbarLocale {
  view: string;
  day: string;
  week: string;
  resource: string;
  space: string;
  today: string;
  previousPeriod: string;
  nextPeriod: string;
  previousResourcePage: string;
  nextResourcePage: string;
  backToWeek: string;
  resourcePage: string;
}

export interface ScheduleLocale {
  toolbar: ScheduleToolbarLocale;
}

export interface Locale {
  months: Array<string>;
  monthsShort: Array<string>;
  weekdays: Array<string>;
  weekdaysShort: Array<string>;
  weekdaysMin: Array<string>;
  start: number;
  schedule: ScheduleLocale;
}

let defaultLocaleCode: LocaleCode = "en";
const localeFactory: Record<string, Locale> = { es, en, fr };

const normalizeLocaleCode = (code: string | undefined): string => {
  return `${code ?? ""}`.trim().toLowerCase();
};

export const registerLocales = (locales: Record<string, Locale> = {}): void => {
  Object.assign(localeFactory, locales);
};

export const getLocales = (): Readonly<Record<string, Locale>> => {
  return localeFactory;
};

export const hasLocale = (code: string): boolean => {
  return Object.prototype.hasOwnProperty.call(localeFactory, normalizeLocaleCode(code));
};

const resolveLocaleCode = (code: string): string => {
  const normalizedCode = normalizeLocaleCode(code);
  if (hasLocale(normalizedCode)) {
    return normalizedCode;
  }

  // Allow common regional codes like "es-MX" to fallback to "es".
  const baseCode = normalizedCode.split("-")[0];
  if (baseCode && hasLocale(baseCode)) {
    return baseCode;
  }

  return defaultLocaleCode;
};

export const getDefaultLocaleCode = (): LocaleCode => {
  return defaultLocaleCode;
};

export const setDefaultLocaleCode = (code: LocaleCode): LocaleCode => {
  defaultLocaleCode = resolveLocaleCode(code);
  return defaultLocaleCode;
};

export class Lng {
  selectedLng: LocaleCode;
  start!: number;

  get lngAvailableObject(): Record<string, Locale> {
    return localeFactory;
  }

  constructor(lng: LocaleCode = defaultLocaleCode, start: number | undefined = undefined) {
    this.selectedLng = resolveLocaleCode(lng);
    this.start =
      start !== undefined
        ? start
        : this.currentLng.start;
  }

  get weekdaysMin(): Array<string> {
    return this.sliceLangList(this.currentLng.weekdaysMin, this.start);
  }

  get currentLng(): Locale {
    return this.lngAvailableObject[resolveLocaleCode(this.selectedLng)];
  }

  get months(): Array<string> {
    return this.currentLng.months;
  }

  get monthsShort(): Array<string> {
    return this.currentLng.monthsShort;
  }

  get weekdays(): Array<string> {
    return this.sliceLangList(this.currentLng.weekdays, this.start);
  }

  get weekdaysShort(): Array<string> {
    return this.sliceLangList(this.currentLng.weekdaysShort, this.start);
  }

  sliceLangList(list: Array<string>, start: number): Array<string> {
    const firstList = list.slice(0, start);
    const secondList = list.slice(start, list.length);
    return [...secondList, ...firstList];
  }
}
