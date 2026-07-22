export const normalizeCssSize = (
  value?: number | string,
): string | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") return `${value}px`;
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
};

export type ResolvedColorKind = "semantic" | "primitive";
export type ResolvedColorPreference = "auto" | "semantic" | "primitive";

export interface ResolveColorCssVariableOptions {
  prefer?: ResolvedColorPreference;
  fallbackContrast?: string;
}

export interface ResolvedColorCssVariable {
  kind: ResolvedColorKind;
  variableName?: string;
  value: string;
  contrastVariableName?: string;
  contrastValue: string;
}

const PRIMITIVE_PALETTE_TONES = new Set([
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
]);

const DEFAULT_PRIMITIVE_PALETTE_FAMILIES = new Set([
  "red",
  "pink",
  "purple",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "brown",
  "neutral",
]);

const parsePrimitiveToneToken = (color: string) => {
  const match = color.match(/^(.*)-(50|100|200|300|400|500|600|700|800|900)$/);

  if (!match) {
    return undefined;
  }

  return {
    family: match[1],
    tone: Number(match[2]),
  };
};

const getPrimitiveContrastTone = (tone?: number): number => {
  if (tone === undefined) {
    return 50;
  }

  return tone >= 500 ? 50 : 900;
};

const UNSUPPORTED_COLOR_LITERAL_PATTERN =
  /^(#([\da-f]{3,8})|rgba?\(|hsla?\(|hwb\(|lab\(|lch\(|oklab\(|oklch\(|color\(|var\(|transparent$|currentcolor$|inherit$|initial$|unset$)/i;

const buildSemanticResolution = (
  color: string,
  fallbackContrast: string,
): ResolvedColorCssVariable => ({
  kind: "semantic",
  variableName: `--e-color-${color}`,
  value: `var(--e-color-${color})`,
  contrastVariableName: `--e-contrast-${color}`,
  contrastValue: `var(--e-contrast-${color}, ${fallbackContrast})`,
});

const buildPrimitiveResolution = (
  color: string,
  fallbackContrast: string,
): ResolvedColorCssVariable => {
  const parsedTone = parsePrimitiveToneToken(color);
  const primitiveFamily = parsedTone?.family ?? color;
  const contrastTone = getPrimitiveContrastTone(parsedTone?.tone);
  const variableName = `--e-palette-${color}`;
  const contrastVariableName = `--e-palette-contrast-${color}`;
  const primitiveContrastFallback = `var(--e-palette-${primitiveFamily}-${contrastTone}, ${fallbackContrast})`;

  return {
    kind: "primitive",
    variableName,
    value: `var(${variableName})`,
    contrastVariableName,
    contrastValue: `var(${contrastVariableName}, ${primitiveContrastFallback})`,
  };
};

const getColorResolutionCandidates = (
  color: string,
  prefer: ResolvedColorPreference,
  fallbackContrast: string,
): ResolvedColorCssVariable[] => {
  const primitiveResolution = buildPrimitiveResolution(color, fallbackContrast);
  const semanticResolution = buildSemanticResolution(color, fallbackContrast);
  const parsedTone = parsePrimitiveToneToken(color);
  const primitiveLooksLikely =
    Boolean(parsedTone && PRIMITIVE_PALETTE_TONES.has(String(parsedTone.tone))) ||
    DEFAULT_PRIMITIVE_PALETTE_FAMILIES.has(color);

  if (prefer === "semantic") {
    return [semanticResolution, primitiveResolution];
  }

  if (prefer === "primitive") {
    return [primitiveResolution, semanticResolution];
  }

  return primitiveLooksLikely
    ? [primitiveResolution, semanticResolution]
    : [semanticResolution, primitiveResolution];
};

export const resolveColorCssVariable = (
  color?: string,
  options: ResolveColorCssVariableOptions = {},
): ResolvedColorCssVariable | undefined => {
  const normalized = color?.trim();

  if (!normalized) {
    return undefined;
  }

  const fallbackContrast = options.fallbackContrast ?? "white";

  if (UNSUPPORTED_COLOR_LITERAL_PATTERN.test(normalized)) {
    return undefined;
  }

  const [resolvedColor] = getColorResolutionCandidates(
    normalized,
    options.prefer ?? "auto",
    fallbackContrast,
  );

  return resolvedColor;
};

export const getColorCssValue = (
  color?: string,
  options?: ResolveColorCssVariableOptions,
): string | undefined => {
  return resolveColorCssVariable(color, options)?.value;
};

export const getColorContrastCssValue = (
  color?: string,
  options?: ResolveColorCssVariableOptions,
): string | undefined => {
  return resolveColorCssVariable(color, options)?.contrastValue;
};