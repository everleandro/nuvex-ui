import type { SVGAttributes } from "vue";

import { SizeProps } from "./size";

export type IconPath = Omit<SVGAttributes, "innerHTML"> & { d: string };

export type IconFontClassValue = string | Array<string>;
export type IconFontClassResolver = (iconName: string) => IconFontClassValue;

export interface IconFontOptions {
  baseClass?: string;
  prefix?: string;
  resolveClass?: IconFontClassResolver;
}

export interface IconProps extends SizeProps {
  color?: string;
  disabled?: boolean;
  stateLayer?: boolean;
  prefix?: string;
  /**
   * @deprecated Use prefix instead.
   */
  preffix?: string;
  viewBox?: string;
  icon?: Array<IconPath> | IconPath | string;
}
