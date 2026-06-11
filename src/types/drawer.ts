import type { ElevationLevel } from "./elevation";

export type DrawerClassKeys =
  | "disabled"
  | "right"
  | "modelValue"
  | "fixed"
  | "floating";

export interface DrawerProps {
  autoFocus?: boolean;
  modelValue?: boolean;
  floating?: boolean;
  absolute?: boolean;
  disabled?: boolean;
  fixed?: boolean;
  devMode?: boolean;
  nav?: boolean;
  right?: boolean;
  restoreFocus?: boolean;
  widthUnit?: string;
  width?: string | number;
  /**
   * Shadow level applied to the drawer.
   * Only takes effect when the drawer is `absolute` or `floating`.
   * These modes are not mutually exclusive with `nav` — a `nav absolute` drawer
   * will still receive elevation. In any other mode the prop is ignored.
   * @default 'sm'
   */
  elevation?: ElevationLevel;
}