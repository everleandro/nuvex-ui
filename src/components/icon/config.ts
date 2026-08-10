import { inject, type InjectionKey } from "vue";

import type {
  IconFontClassValue,
  IconFontOptions,
} from "@/types";

export interface ResolvedIconFontOptions {
  baseClass: string;
  prefix: string;
  resolveClass?: IconFontOptions["resolveClass"];
}

export const defaultIconFontOptions: ResolvedIconFontOptions = {
  baseClass: "icon",
  prefix: "icon-",
};

export const iconFontInjectionKey: InjectionKey<ResolvedIconFontOptions> =
  Symbol("e-icon-font");

const normalizeStringOption = (value: string | undefined, fallback: string): string => {
  return value === undefined ? fallback : value.trim();
};

export const normalizeIconFontOptions = (
  options?: IconFontOptions,
): ResolvedIconFontOptions => {
  return {
    baseClass: normalizeStringOption(
      options?.baseClass,
      defaultIconFontOptions.baseClass,
    ),
    prefix: normalizeStringOption(
      options?.prefix,
      defaultIconFontOptions.prefix,
    ),
    resolveClass: options?.resolveClass,
  };
};

export const normalizeIconFontClassList = (
  value?: IconFontClassValue,
): Array<string> => {
  const classValues = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  return classValues.flatMap((classValue) => {
    return `${classValue}`
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  });
};

export const useIconFont = (): ResolvedIconFontOptions => {
  return inject(iconFontInjectionKey, defaultIconFontOptions);
};